define([
    'google-drive-api',
    'spinner/site-global-loading-bar',
    //TODO: thinking of using tree model for traversing brain tree
    './../../lib/TreeModel'
], function(
    googleDriveApi,
    siteGlobalLoadingBar,
    TreeModel
) {
    'use strict';

    //TODO: thinking of using tree model for traversing brain tree
    //console.debug('TreeModel: ', TreeModel);

    var BRAIN_FOLDER_NAME = 'Brain';
    var brainFolder;
    var thoughtsTree = {};
    var THOUGHTS_TREE_CACHE_KEY = 'thoughtStorage.thoughtsTree';

    var spinner = siteGlobalLoadingBar.create('thought-storage');

    var self = this;

    return {
        scanDrive: scanDrive,
        save: save,
        update: update,
        getThoughts: getThoughts,
        fetchChildThoughts: fetchChildThoughts,
        restoreFromCache: restoreFromCache,
        findThoughtById: findThoughtById,
        getThoughtContent: getThoughtContent,
        logTree: logTree
    };

    function logTree() {
        console.debug('==============\n Thoughts Tree\n===========');
        forEachNode(function(node, depth) {
            var msg = node.name;
            for (var i = 0; i <= depth; i++) {
                msg = '>> ' + msg;
            }
            console.debug(msg);
        });
    }

    function findThoughtById(id) {
        console.debug('thought-storage.findThoughtById(). id: ', id);
        console.debug('thoughtsTree: ', thoughtsTree);
       var depthLimit = 4;
       var nodesLimit = 50;
       var nodesCount = 0;
       var iterationLimitReached = false;

        return findInNode(thoughtsTree.root);

        function findInNode(node, currentDepth) {
            if (iterationLimitReached) return;
            //console.debug('findInNode() called. Node: ', node);
            nodesCount++;
            if (!currentDepth) currentDepth = 0;
            //console.debug('findInNode(): currentDepth: ', currentDepth);
            if (node.id == id) {
                console.debug('findInNode(): found the node! :', node);
                return node;
            } else if (currentDepth < depthLimit && nodesCount < nodesLimit) {
                //console.debug('Traversing tree, currentDepth: ', currentDepth);
                    var foundNode;
                    _.each(node.children, function(childNode) {
                        foundNode = foundNode || findInNode(childNode, currentDepth + 1);
                    });
                    //console.debug('foundNode: ', foundNode);
                    return foundNode;

            } else {
                console.warn('Traversing tree: reached depth/nodes limit, exiting');
                console.warn('Traversing tree: currentDepth: ', currentDepth);
                console.warn('Traversing tree: nodesCount: ', nodesCount);
                iterationLimitReached = true;
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
       console.debug('forEachNode() called!');
       var depthLimit = 4;
       var nodesLimit = 50;
       var nodesCount = 0;

       executeForNode(thoughtsTree.root, func); 

       function executeForNode(node, func, currentDepth) {
           //console.debug('executeForNode() called. CurrentDepth: ', currentDepth, 'nodesCount: ', nodesCount);
           if (!currentDepth) currentDepth = 0;
           //console.debug('executeForNode(): node: ', node);

           if (isRecursionLimitReached(currentDepth, nodesCount)) return;

           func(node, currentDepth);
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

    /**
     * @param {String} options.parentId
     * @param {Array} options.children
     */
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

    function update(thought) {
        console.debug('thoughtStorage.update(), thought: ', thought);

        var updateSpinner = spinner.create('updating thought');
        updateSpinner.show();

        return findThoughtContentFile(thought)
            .then(function (thoughtContentFile) {
                return googleDriveApi.updateFile({
                    fileId: thoughtContentFile.id,
                    text: thought.content
                });
            })
            .then(function(response) {
                console.debug('thoughtStorage.update() sucess! Response: ', response);
            })
            .finally(function() {
                updateSpinner.hide();
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
            findBrainFolder().then(function(searchResult) {
                console.debug('findBrainFolder searchResult: ', searchResult);
                if (searchResult.length == 0) {
                    console.info('thoughtStorage: Brain folder on Google Drive not found, create a new one.');
                    createBrainFolder().then(function(createdBrainFolder) {
                        brainFolder = createdBrainFolder;
                        resolve(createdBrainFolder);
                    });
                } else {
                    console.debug('thoughtStorage: Brain folder found, reading it');
                    console.info('thoughtStorage.scanDrive(): found Brain folder named "' + BRAIN_FOLDER_NAME + '"');
                    brainFolder = searchResult[0];
                    readBrain().then(resolve);
                }
            })
            .finally(function() {
                spinner.hide();
            });
        });
    }

    function getThoughts() {
        console.debug('thoughtStorage.getThoughts(). Returning thoughts: ', thoughtsTree);
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
            if (response.code && response.code === -1) {
                throw new Error('createBrainFolder error (code = -1)! Response: response');
            }

            console.debug('createBrainFolder successs!!, response: ', response);
            console.info('thoughtStorage.createBrainFolder(): created brain folder named: "' + BRAIN_FOLDER_NAME + '"');

            var createdFolder = response;
            thoughtsTree.root = createdFolder;
            thoughtsTree.root.children = [];

            return createFile({
                name: BRAIN_FOLDER_NAME + '.txt',
                content: 'The root of your thoughts :)',
                parents: [createdFolder.id]
            });
        }).then(function(response) {
            console.debug('createBrainFolder(): create brain txt file success!, response: ', response);
            console.info('thoughtStorage.createBrainFolder(): created brain txt file named: "' + BRAIN_FOLDER_NAME + '.txt"');
        })
        .finally(function() {
            spinner.hide();
        });
    }

    /**
     * Try to find "Brain" folder in google drive root.
     */
    function findBrainFolder() {
        return googleDriveApi.findByName({
            name: BRAIN_FOLDER_NAME,
            folderId: 'root'
        });
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

    function getThoughtContent(thought) {
        return findThoughtContentFile(thought)
            .then(function (thoughtContentFile) {
                return getTextFileContents({
                    fileId: thoughtContentFile.id
                });
            });
    }

    function findThoughtContentFile(thought) {
        return googleDriveApi.findByName({
            name: thought.name + '.txt',
            folderId: thought.id
        }).then(function(foundFiles) {
            if (!foundFiles) {
                throw new Error('thoughtStorage.getThoughtContent(): no thought content file found for thought: "' + thought.name + '"');
            }

            var thoughtContentFile = foundFiles[0];
            console.debug('thoughtStorage.getThoughtContent(), thoughtContentFile: ', thoughtContentFile);

            return thoughtContentFile;
        });
    }
    
    function getTextFileContents(options) {
        var requestParams = {
            fileId: options.fileId,
            alt: 'media'
        };

        var request = gapi.client.request({
            path: '/drive/v3/files/' + requestParams.fileId,
            method: 'GET',
            params: {
                alt: 'media'
            }
        });

        //var request = googleDriveApi.client.files.get(requestParams);

        spinner.show();
        var promise = new Promise(function(resolve, reject) {
            request.execute(function(gapiReturnsFalseHereForBlobs, responsePlain) {
                console.debug('thoughtStorage.getTextFileContents(), responsePlain: ', responsePlain);
                var responseObject = JSON.parse(responsePlain);
                console.debug('thoughtStorage.getTextFileContents(), responseObject: ', responseObject);
                var responseBody = responseObject.gapiRequest.data.body;
                console.debug('thoughtStorage.getTextFileContents(), responseBody: ', responseBody);

                var fileText = responseBody;

                resolve(fileText);
            });
        })
        .finally(function() {
            spinner.hide();
        });

        return promise;
    }
});
