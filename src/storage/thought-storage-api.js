define([
    'api/google-drive-api',
    'ui/spinner/site-global-loading-bar',
    'ui/ui-error-notification'
], function(
    googleDriveApi,
    siteGlobalLoadingBar,
    uiErrorNotification
) {
    'use strict';

    var APP_FOLDER_NAME = 'NeuralNotes';

    var spinner = siteGlobalLoadingBar.create('thought-storage-api');

    var service = {
        /**
         * App root folder on Google Drive
         */
        appRootFolder: undefined,

        scanDrive: scanDrive,
        fetchParentThought: fetchParentThought,
        fetchChildThoughts: fetchChildThoughts,
        getThoughtContent: getThoughtContent,
        create: create,
        update: update,
    };

    return service;

    function setAppRootFolder(appRootFolder) {
        service.appRootFolder = appRootFolder;
        return appRootFolder;
    }

    function getAppRootFolder() {
        return service.appRootFolder;
    }

    /**
     * Try to find "APP_FOLDER_NAME" folder on google drive,
     * then read its contents,
     * OR create the "APP_FOLDER_NAME" folder, if it's not found.
     */
    function scanDrive() {
        console.debug('Scan thought storage...');
        return new Promise(function(resolve, reject) {
            spinner.show();
            findAppFolder().then(function(searchResult) {
                if (searchResult.length == 0) {
                    console.info('App root folder on Google Drive not found, create a new one.');
                    createAppRootFolder()
                        .then(setAppRootFolder)
                        .then(createAppRootTextFile)
                        .then(function() {
                            resolve(getAppRootFolder());
                        });
                } else {
                    console.info('App root folder found on Google Drive');
                    var appRootFolder = searchResult[0];
                    setAppRootFolder(appRootFolder);
                    resolve(appRootFolder);
                }
            })
            .finally(function() {
                spinner.hide();
            });
        });
    }

    /**
     * Get files from the root "APP_FOLDER_NAME" folder.
     */
    function readAppRootFolder() {
        console.debug('Reading ' + APP_FOLDER_NAME + ' folder...');
        return new Promise(function(resolve, reject) {
            getFiles(service.appRootFolder.id).then(function(files) {
                service.appRootFolder.children = [];
                _.each(files, function(file) {
                    if (file.mimeType == 'application/vnd.google-apps.folder') {
                        service.appRootFolder.children.push(file);
                    }
                });
            }).then(resolve);
            //
            // code for getting children of all children of App root folder folder.
            // -------------------------------
            //}).then(function() {
                // (currently displaying only one level for better performance)
                //var promises = [];
                //service.appRootFolder.children.forEach(function(thought) {
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
            console.debug('[Get] Child thoughts for: "' + thoughtId + '"');
            getFiles(thoughtId).then(function(files) {
                //thoughts.push(appRootFolder);
                var children = [];
                _.each(files, function(file) {
                    if (file.mimeType == 'application/vnd.google-apps.folder') {
                        children.push(file);
                    }
                });
                console.debug('[Loaded] thoughts for "' + thoughtId + '"');
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
        console.debug('[Get] Thought folder for: "' + thoughtId + '"');
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
                console.debug('[Loaded] Thought folder for: "' + thoughtId + '"');
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
        //        //'q': 'name = "' + APP_FOLDER_NAME + '"'
        //    }
        //});
        var request = gapi.client.drive.files.list({
          'pageSize': 10,
          'fields': googleDriveApi.FILE_LIST_FIELDS,
          'q': '"' + folderId + '" in parents'
        });
  
        spinner.show();
        var promise = new Promise(function(resolve, reject) {
              request.execute(function(resp) {
                console.debug('[Loaded] Files: ', resp);
                if (!resp.files) {
                    var errorMessage = 'Remote Storage API: Failed to get files';
                    uiErrorNotification.show('Connection with Google Drive failed.\n Can not get files.');
                    throw new Error(errorMessage);
                }

                //TODO: same code is duplicated in google-drive-api.js - Refactor!
                resp.files.forEach(googleDriveApi.parseParents);

                spinner.hide();
                resolve(resp.files);
              })
        });
  
        return promise;
    }

    /**
     * Create "APP_FOLDER_NAME" directory in the root of google drive.
     */
    function createAppRootFolder() {
        console.info('Creating a new App root folder...');
        spinner.show();
        return createDirectory({
            name: APP_FOLDER_NAME
        }).then(function(response) {
            if (response.code && response.code === -1) {
                throw new Error('createAppRootFolder error (code = -1)! Response: response');
            }
            console.info('Created App root folder');

            var createdFolder = response;

            return createdFolder;
        })
        .finally(function() {
            spinner.hide();
        });
    }

    /**
     * Create a text file for the root folder,
     * to store root note's content.
     */
    function createAppRootTextFile(appRootFolder) {
        console.info('Creating app root text file...');
        return createFile({
            name: APP_FOLDER_NAME + '.txt',
            content: 'Edit this text...',
            parents: [appRootFolder.id]
        })
            .then(function(response) {
                console.info('Created app root textfile');
                return response;
            })
            .catch(function(error) {
                console.error('Failed to create App Root Text file. Error:', error);
            throw error;
        });
    }

    /**
     * Try to find "APP_FOLDER_NAME" folder in google drive root.
     */
    function findAppFolder() {
        return googleDriveApi.findByName({
            name: APP_FOLDER_NAME,
            folderId: 'root'
        });
    }

    function findAppRootTextFile(appRootFolder) {
        return getThoughtContent(appRootFolder);
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
                console.debug('Created a new file: ' + newFile.name);
                return updateFile(newFile, options.content); 
            })
            .then(function(updatedFile) {
                console.debug('Updated file: ' + updatedFile.name);
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
        console.debug('Creating empty file...');
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
        console.debug('Updating file: ' + createdFile.name);
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
        if (!thought) {
            throw new Error('thoughtStorageApi.getThoughtContent(): passed thought is undefined');
        }
        console.info('[Get] thought content for "' + thought.name + '"...');
        return findThoughtContentFile(thought)
            .then(function (thoughtContentFile) {
                if (!thoughtContentFile) throw 'thoughtStorageApi.getThoughtContent(): thoughtContentFile is undefined';
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
            console.debug('[Loaded] Thought content file: ' + thought.name);

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
                var responseObject = JSON.parse(responsePlain);
                var responseBody = responseObject.gapiRequest.data.body;
                console.debug('[Loaded] Text file contents');

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
        if (!parentThought) {
            parentThought = appRootFolder;
        }

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
        console.debug('Updaing thought: ' + thought);

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
                if (response.error) {
                    console.error('Failed to update file content! Response: ', response);
                    throw response;
                }
            })
            .finally(function() {
                updateSpinner.hide();
            });

    }
});
