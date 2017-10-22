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
    var THOUGHTS_TREE_CACHE_KEY = 'thoughtStorage.thoughtsTree';

    var spinner = siteGlobalLoadingBar.create('thought-storage');

    var service = {
        barinFolder: undefined,
        scanDrive: scanDrive,
        fetchParentThought: fetchParentThought,
        fetchChildThoughts: fetchChildThoughts,
        getThoughtContent: getThoughtContent,
        create: create,
        update: update,
    };

    return service;

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
                        service.brainFolder = createdBrainFolder;
                        resolve(createdBrainFolder);
                    });
                } else {
                    console.debug('thoughtStorage: Brain folder found, reading it');
                    console.info('thoughtStorage.scanDrive(): found Brain folder named "' + BRAIN_FOLDER_NAME + '"');
                    service.brainFolder = searchResult[0];
                    readBrain().then(resolve);
                }
            })
            .finally(function() {
                spinner.hide();
            });
        });
    }

    /**
     * Get files from brain folder, which are childs
     * of the root "Brain" node.
     */
    function readBrain() {
        console.debug('thoughtStorage.readBrain()');
        return new Promise(function(resolve, reject) {
            getFiles(service.brainFolder.id).then(function(files) {
                console.debug('files inside the brain folder: ', files);
                console.debug('files saved to thoughts storage');
                service.brainFolder.children = [];
                _.each(files, function(file) {
                    if (file.mimeType == 'application/vnd.google-apps.folder') {
                        service.brainFolder.children.push(file);
                    }
                });
            }).then(resolve);
            //
            // code for getting children of all children of Brain folder.
            // -------------------------------
            //}).then(function() {
                // (currently displaying only one level for better performance)
                //var promises = [];
                //service.brainFolder.children.forEach(function(thought) {
                //    var promise = getFiles(thought.id).then(function(files) {
                //        thought.children = files;
                //    });
                //    promises.push(promise);
                //});

                //Promise.all(promises).then(resolve);
            //});
        });

    }

    /**
     * Find child directories for given thoughtId folder.
     */
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
                resolve(children);
            })
            .finally(function() {
                spinner.hide();
            });
        });
    }

    /**
     * Fetch parent folder
     */
    function fetchParentThought(thoughtId) {
        return fetchThoughtById(thoughtId).then(function(parentThought) {
            return parentThought;
        });
    }

    /**
     * Fetch thought folder by id.
     */
    function fetchThoughtById(thoughtId) {
        console.debug('thoughtStorage.fetchThoughtById(): thoughtId: ', thoughtId);
        spinner.show();
        //var request = gapi.client.request({
        //    path: '/upload/drive/v3/files/' + thoughtId,
        //    method: 'GET',
        //    params: {
        //        uploadType: 'media'
        //    },
        //    body: content
        //});

        var request = googleDriveApi.client.files.get({
            fileId: thoughtId,
            fields: googleDriveApi.FILE_FIELDS
        });

        var promise = new Promise(function(resolve, reject) {
            request.execute(function(resp) {
                console.debug('thoughtStorage.fetchThoughtById(): response: ', resp);
                var file = resp;
                file = googleDriveApi.parseParents(file);
                resolve(file);
            });
        })
        .finally(function() {
            spinner.hide();
        });

        return promise;
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
          'fields': googleDriveApi.FILE_LIST_FIELDS,
          'q': '"' + folderId + '" in parents'
        });
  
        spinner.show();
        var promise = new Promise(function(resolve, reject) {
              request.execute(function(resp) {
                //console.debug('resp: ', resp);
                //var thoughts = resp.files;
                //storage.thoughts = thoughts;
                if (!resp.files) throw new Error('getFiles() received response without "files" property');

                //TODO: same code is duplicated in google-drive-api.js - Refactor!
                resp.files.forEach(googleDriveApi.parseParents);

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

    /**
     * Create a thought: a directory and a file with thought
     * contents inside.
     */
    function create(thought, parentThought) {
        console.debug('create(). parentThought: ', parentThought);
        if (!parentThought) {
            parentThought = brainFolder;
        }

        console.debug('thoughtStorage.create(). Thought: ', thought);
        console.debug('googleDriveApi: ', googleDriveApi);


        spinner.show();
        return createDirectory({
            name: thought.name,
            parents: [parentThought.id]
        }).then(function(createdDirectory) {
            thought.id = createdDirectory.id;
            return createFile({
                name: thought.name + '.txt',
                content: thought.content,
                parents: [createdDirectory.id],
            });
        })
        .then(function(createdTxtFile) {
            return thought;
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
});
