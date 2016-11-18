define([
    'google-drive-api',
    'spinner/site-global-loading-bar'
], function(
    googleDriveApi,
    siteGlobalLoadingBar
) {
    'use strict';

    var BRAIN_FOLDER_NAME = 'Brain';
    var brainFolder;
    var thoughtsTree = {};
    var THOUGHTS_TREE_CACHE_KEY = 'thoughtStorage.thoughtsTree';

    var spinner = siteGlobalLoadingBar.create('thought-storage');

    var self = this;

    return {
        scanDrive: scanDrive,
        save: save,
        getThoughts: getThoughts,
        fetchChildThoughts: fetchChildThoughts,
        restoreFromCache: restoreFromCache
    };

    function findThoughtById(id) {
        console.debug('thought-storage.findThoughtById(). id: ', id);
        console.debug('thoughtsTree: ', thoughtsTree);
       var depthLimit = 4;
       var nodesLimit = 50;
       var nodesCount = 0;
        return findInNode(thoughtsTree.root);

        function findInNode(node, currentDepth) {
            console.debug('findInNode() called. Node: ', node);
            nodesCount++;
            if (!currentDepth) currentDepth = 0;
            console.debug('findInNode(): currentDepth: ', currentDepth);
            var foundNode = _.findWhere(node.children.concat(node), {id: id});
            if (foundNode) {
                console.debug('findInNode(): found the node! :', foundNode);
                return foundNode;
            } else if (currentDepth < depthLimit && nodesCount < nodesLimit) {
                console.debug('Traversing tree, currentDepth: ', currentDepth);
                    _.each(node.children, function(childNode) {
                        findInNode(node, currentDepth + 1);
                    });

            } else {
                console.warn('Traversing tree: reached depth/nodes limit, exiting');
                console.warn('Traversing tree: currentDepth: ', currentDepth);
                console.warn('Traversing tree: nodesCount: ', nodesCount);
                return;
            }
        }
    }

    function mapTree(func) {
       console.debug('mapTree() called! func: ', func.toString());
       var depthLimit = 4;
       var nodesLimit = 50;
       var nodesCount = 0;

       var mappedTree = {};
       executeForNode(thoughtsTree.root, func); 
       return mappedTree;

       function executeForNode(node, func,  parentNode, currentDepth) {
           nodesCount++;

           var clonedNode = _.clone(node);
           var mappedNode = func(clonedNode);

           if (!currentDepth) currentDepth = 0;
           if (!parentNode) {
               mappedTree.root = mappedNode;
           } else {
               parentNode.children.push(mappedNode);
               //console.debug('mapTree.executeForNode() called. CurrentDepth: ', currentDepth, 'nodesCount: ', nodesCount);
               //console.debug('mapTree.executeForNode(): node: ', node);

               if (isRecursionLimitReached(currentDepth, nodesCount)) return;
           }

           if (node.children) {
               clonedNode.children = [];
               _.each(node.children, function(childNode) {
                   executeForNode(childNode, func, clonedNode, currentDepth + 1);
               });
           } else {
               //console.debug('mapTree(): reached leaf node: ', node);
           }
       }

       function isRecursionLimitReached(currentDepth, nodesCount) {
           var limitReached = (nodesCount > nodesLimit || currentDepth > depthLimit);
           if (limitReached) {
                console.warn('Traversing tree: reached depth/nodes limit, exiting');
                console.warn('Traversing tree: currentDepth: ', currentDepth);
                console.warn('Traversing tree: nodesCount: ', nodesCount);
           } 

           return limitReached;
       }
    }

    function forEachNode(func) {
       console.debug('forEachNode() called! func: ', func.toString());
       var depthLimit = 4;
       var nodesLimit = 50;
       var nodesCount = 0;

       executeForNode(thoughtsTree.root, func); 

       function executeForNode(node, func, currentDepth) {
           //console.debug('executeForNode() called. CurrentDepth: ', currentDepth, 'nodesCount: ', nodesCount);
           if (!currentDepth) currentDepth = 0;
           //console.debug('executeForNode(): node: ', node);

           if (isRecursionLimitReached(currentDepth, nodesCount)) return;

           func(node);
           if (node.children) {
               _.each(node.children, function(node) {
                   executeForNode(node, func, currentDepth + 1);
               });
           }
       }

       function isRecursionLimitReached(currentDepth, nodesCount) {
           var limitReached = (nodesCount > nodesLimit || currentDepth > depthLimit);
           if (limitReached) {
                console.warn('Traversing tree: reached depth/nodes limit, exiting');
                console.warn('Traversing tree: currentDepth: ', currentDepth);
                console.warn('Traversing tree: nodesCount: ', nodesCount);
           } 

           return limitReached;
       }
    }

    function addChildrenToTree(options) {
        console.debug('addChildrenToTree() called, options: ', options);
        console.debug('thought-storage.addChildrenToTree()');
        var parentThought = findThoughtById(options.parentId);
        console.debug('addChildrenToTree(): found parentThought by id: ', parentThought);
        parentThought.children = options.children;
        saveTreeToCache();
    }

    function saveTreeToCache() {
        console.debug('saveTreeToCache(): thoughtsTree: ', thoughtsTree);
        //var decycled = deleteLinksToParents(thoughtsTree.map(deleteLinkToParent);
        //window.localStorage.setItem(THOUGHTS_TREE_CACHE_KEY, JSON.stringify(thoughtsTree));
        //var decycledTree = {};
        //forEachNode(function(node) {
        //    console.debug('forEachNode(): node.name: ', node.name);
        //});
        
        var decycledTree = mapTree(function(node) {
            //console.debug('mapTree(): node.name: ', node.name);
            //console.debug('mapTree(): node.parent: ', node.parent);
            delete node.parent;
            return node;
        });

        console.debug('saveTreeToCache(): decycledTree: ', decycledTree);

        window.localStorage.setItem(THOUGHTS_TREE_CACHE_KEY, JSON.stringify(decycledTree));
    }

    function loadTreeFromCache() {
        console.debug('loadTreeFromCache()');
        var cachedTreeString = window.localStorage.getItem(THOUGHTS_TREE_CACHE_KEY);

        if (cachedTreeString) {
            console.debug('loadTreeFromCache(): cache found, cache string: ', cachedTreeString);
            return JSON.parse(cachedTreeString);
        } else {
            console.debug('loadTreeFromCache(): cache not found');
            return undefined;
        }
    }

    /**
     * Create a thought: a directory and a file with thought
     * contents inside.
     */
    function save(thought, parentThought) {
        console.debug('save(). parentThought: ', parentThought);
        if (!parentThought) {
            parentThought = brainFolder;
        }

        console.debug('thoughtStorage.save(). Thought: ', thought);
        console.debug('googleDriveApi: ', googleDriveApi);

        spinner.show();
        return createDirectory({
            name: thought.name,
            parents: [parentThought.id]
        }).then(function(createdDirectory) {
            return createFile({
                name: thought.name + '.txt',
                content: thought.content,
                parents: [createdDirectory.id],
            });
        })
        .finally(function() {
            spinner.hide();
        });
    }

    function restoreFromCache() {
        var cachedThoughtsTree = loadTreeFromCache();
        if (cachedThoughtsTree) {
            console.debug('restoreFromCache(): cachedThoughtsTree: ', cachedThoughtsTree);
            thoughtsTree = cachedThoughtsTree;
            return cachedThoughtsTree;
        } else {
            console.debug('restoreFromCache(): thoughts cache is empty');
            return false;
        }
    }

    /**
     * Try to find "Brain" folder on google drive,
     * then read its contents,
     * OR create the "Brain" folder, if it's not found.
     */
    function scanDrive() {
        console.debug('thoughtStorage.scanDrive()');
        return new Promise(function(resolve, reject) {
            spinner.show();
            findBrainFolder().then(function(result) {
                console.debug('findBrainFolder result: ', result);
                if (result.length == 0) {
                    console.info('thoughtStorage: Brain folder on Google Drive not found, create a new one.');
                    createBrainFolder().then(resolve);
                } else {
                    console.debug('thoughtStorage: Brain folder found, reading it');
                    brainFolder = result[0];
                    readBrain().then(resolve);
                }
            })
            .finally(function() {
                spinner.hide();
            });
        });
    }

    function getThoughts() {
        return thoughtsTree;
    }

    /**
     * Get files from brain folder, which are childs
     * of the root "Brain" node.
     */
    function readBrain() {
        console.debug('thoughtStorege.readBrain()');
        return new Promise(function(resolve, reject) {
            getFiles(brainFolder.id).then(function(files) {
                console.debug('files inside the brain folder: ', files);
                thoughtsTree.root = brainFolder;
                console.debug('files saved to thoughts storage');
                brainFolder.children = [];
                _.each(files, function(file) {
                    if (file.mimeType == 'application/vnd.google-apps.folder') {
                        brainFolder.children.push(file);
                    }
                });
                console.debug('thoughtStorage.readBrain(), stored thoughtsTree: ', thoughtsTree);
            }).then(resolve);
            //
            // code for getting children of all children of Brain folder.
            // -------------------------------
            //}).then(function() {
                // (currently displaying only one level for better performance)
                //var promises = [];
                //brainFolder.children.forEach(function(thought) {
                //    var promise = getFiles(thought.id).then(function(files) {
                //        thought.children = files;
                //    });
                //    promises.push(promise);
                //});

                //Promise.all(promises).then(resolve);
            //});
        });

    }

    function fetchChildThoughts(thoughtId) {
        spinner.show();
        return new Promise(function(resolve, reject) {
            console.debug('fetchChildThoughts() for thoughtId: ', thoughtId);
            getFiles(thoughtId).then(function(files) {
                console.debug('files inside the thought folder: ', files);
                //thoughts.push(brainFolder);
                var children = [];
                _.each(files, function(file) {
                    if (file.mimeType == 'application/vnd.google-apps.folder') {
                        children.push(file);
                    }
                });
                console.debug('fetchChildThoughts() thoughts: ', children);
                addChildrenToTree({
                    parentId: thoughtId,
                    children: children
                });
                resolve(children);
            })
            .finally(function() {
                spinner.hide();
            });
        });
    }

    /**
     * Get files from a folder.
     */
    function getFiles(folderId) {
        //var request = gapi.client.request({
        //    path: '/drive/v3/files/' + folderId,
        //    method: 'GET',
        //    params: {
        //        //'pageSize': 10,
        //        //'fields': "nextPageToken, files(id, name)",
        //        //'q': 'name = "' + BRAIN_FOLDER_NAME + '"'
        //    }
        //});
        console.debug('getFiles()');
        var request = gapi.client.drive.files.list({
          'pageSize': 10,
          'fields': "nextPageToken, files(id, name, mimeType)",
          'q': '"' + folderId + '" in parents'
        });
  
        spinner.show();
        var promise = new Promise(function(resolve, reject) {
              request.execute(function(resp) {
                //console.debug('resp: ', resp);
                //var thoughts = resp.files;
                //storage.thoughts = thoughts;
                if (!resp.files) throw new Error('getFiles() received response without "files" property');

                spinner.hide();
                resolve(resp.files);
              })
        });
  
        return promise;
    }

    /**
     * Create "Brain" directory in the root of google drive.
     */
    function createBrainFolder() {
        console.debug('createBrainFolder!');
        spinner.show();
        return createDirectory({
            name: BRAIN_FOLDER_NAME
        }).then(function(response) {
            console.debug('createBrainFolder successs!!, response: ', response);
        })
        .finally(function() {
            spinner.hide();
        });
    }

    /**
     * Try to find "Brain" folder in google drive root.
     */
    function findBrainFolder() {
        //console.debug('getFiles()');
        var request = gapi.client.drive.files.list({
          'pageSize': 10,
          'fields': "nextPageToken, files(id, name)",
          'q': 'name = "' + BRAIN_FOLDER_NAME + '"'
        });
  
        spinner.show();
        var promise = new Promise(function(resolve, reject) {
              request.execute(function(resp) {
                //console.debug('resp: ', resp);
                //var thoughts = resp.files;
                //storage.thoughts = thoughts;
                resolve(resp.files);
                spinner.hide();
              });
        });
  
        return promise;
    }

    /**
     * Create a file with text content on google drive.
     *
     * @param {String} options.name - File name.
     * @param {Array} options.parents - Parent directories for the file
     * (goolge drive allows many parents).
     * @param {String} options.content - Text content of the file.
     *
     * src of code:
     * this guy from stackoverflow is a GOD! :)
     * http://stackoverflow.com/a/10323612/1657101
     */
    function createFile(options) {
        spinner.show();
        return createEmptyFile({
            name: options.name,
            parents: options.parents
        })
            .then(function(newFile) {
                console.debug('created new file! :) ', newFile);
                return updateFile(newFile, options.content); 
            })
            .then(function(updatedFile) {
                console.debug('updated file: ', updatedFile);
                console.debug('Thought create success!');
                return updatedFile;
            })
            .finally(function() {
                spinner.hide();
            });

    }

    /**
     * Create empty file, which may be filled with content later,
     * (in a separate request) to avoid making the multipart request.
     */
    function createEmptyFile(options) {
        console.debug('createEmptyFile()');
        var request = googleDriveApi.client.files.create({
            name: options.name,
            mimeType: "text/plain",
            parents: options.parents
            //"description": "test file"
        });

        spinner.show();
        var promise = new Promise(function(resolve, reject) {
            request.execute(function(newFile) {
                resolve(newFile);
            });
        })
        .finally(function() {
            spinner.hide();
        });

        return promise;
    };

    /**
     * Update empty file with text content.
     */
    function updateFile(createdFile, content) {
        console.debug('updateFile()');
        spinner.show();
        var request = gapi.client.request({
            path: '/upload/drive/v3/files/' + createdFile.id,
            method: 'PATCH',
            params: {
                uploadType: 'media'
            },
            body: content
        });

        // this almost works but makes request to url
        // without '/upload/' T_T
        //var request = googleDriveApi.client.files.update(
        //    {
        //        fileId: createdFile.id,
        //        name: 'test-updated3.txt',
        //        uploadType: 'media'
        //    },
        //    btoa('content plzzzz ;))')
        //);

        var promise = new Promise(function(resolve, reject) {
            request.execute(function(resp) {
                resolve(resp);
            });
        })
        .finally(function() {
            spinner.hide();
        });

        return promise;
    }

    /**
     * Create a directory.
     *
     * @param {String} options.name - Directory name.
     * @param {Array} options.parents - Parent directories for the created
     * directory (goolge drive allows many parents).
     */
    function createDirectory(options) {
        var requestParams = {
            "name": options.name,
            "mimeType": "application/vnd.google-apps.folder",
            //"description": "test file"
        };

        if (options.parents) {
            requestParams.parents = options.parents;
        }

        var request = googleDriveApi.client.files.create(requestParams);

        spinner.show();
        var promise = new Promise(function(resolve, reject) {
            request.execute(function(newFile) {
                resolve(newFile);
            });
        })
        .finally(function() {
            spinner.hide();
        });

        return promise;
    }
});
