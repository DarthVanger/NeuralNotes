define([
    'google-drive-api'
], function(
    googleDriveApi
) {
    'use strict';

    var BRAIN_FOLDER_NAME = 'Brain';
    var brainFolder;
    var thoughts = [];

    var self = this;

    return {
        scanDrive: scanDrive,
        save: save,
        getThoughts: getThoughts
    };

    function save(thought) {
        console.debug('thoughtStorage.save(). Thought: ', thought);
        console.debug('googleDriveApi: ', googleDriveApi);
        return createFile(thought.name + '.txt', thought.content);
    }

    function scanDrive() {
        return new Promise(function(resolve, reject) {
            findBrainFolder().then(function(result) {
                console.debug('findBrainFolder result: ', result);
                if (result.length == 0) {
                    createBrainFolder().then(resolve);
                } else {
                    brainFolder = result[0];
                    readBrain().then(resolve);
                }
            });
        });
    }

    function getThoughts() {
        return thoughts;
    }

    function readBrain() {
        console.debug('readBrain()');
        return getFiles(brainFolder.id).then(function(files) {
            console.debug('files inside the brain folder: ', files);
            console.debug('files saved to thoughts storage');
            thoughts = files;
        });
    }
    
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
          'fields': "nextPageToken, files(id, name)",
          'q': '"' + brainFolder.id + '" in parents'
        });
  
        var promise = new Promise(function(resolve, reject) {
              request.execute(function(resp) {
                //console.debug('resp: ', resp);
                //var thoughts = resp.files;
                //storage.thoughts = thoughts;
                if (!resp.files) throw new Error('getFiles() received response without "files" property');
                resolve(resp.files);
              });
        });
  
        return promise;
    }

    function createBrainFolder() {
        console.debug('createBrainFolder!');
        return createDirectory(BRAIN_FOLDER_NAME).then(function(response) {
            console.debug('createBrainFolder successs!!, response: ', response);
        });
    }

    function findBrainFolder() {
        //console.debug('getFiles()');
        var request = gapi.client.drive.files.list({
          'pageSize': 10,
          'fields': "nextPageToken, files(id, name)",
          'q': 'name = "' + BRAIN_FOLDER_NAME + '"'
        });
  
        var promise = new Promise(function(resolve, reject) {
              request.execute(function(resp) {
                //console.debug('resp: ', resp);
                //var thoughts = resp.files;
                //storage.thoughts = thoughts;
                resolve(resp.files);
              });
        });
  
        return promise;
    }

    // this guy from stackoverflow is a GOD! :)
    // http://stackoverflow.com/a/10323612/1657101
    function createFile(name, content) {
        return createEmptyFile(name)
            .then(function(newFile) {
                console.debug('created new file! :) ', newFile);
                return updateFile(newFile, content); 
            })
            .then(function(updatedFile) {
                console.debug('updated file: ', updatedFile);
                console.debug('Thought create success!');
            });

    }

    function createDirectory(name) {
        var request = googleDriveApi.client.files.create({
            "name": name,
            "mimeType": "application/vnd.google-apps.folder",
            //"description": "test file"
        });

        var promise = new Promise(function(resolve, reject) {
            request.execute(function(newFile) {
                resolve(newFile);
            });
        });

        return promise;
    }

    function createEmptyFile(filename) {
        console.debug('createEmptyFile()');
        var request = googleDriveApi.client.files.create({
            name: filename,
            mimeType: "text/plain",
            parents: [brainFolder.id]
            //"description": "test file"
        });

        var promise = new Promise(function(resolve, reject) {
            request.execute(function(newFile) {
                resolve(newFile);
            });
        });

        return promise;
    };

    function updateFile(createdFile, content) {
        console.debug('updateFile()');
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
        });

        return promise;
    }
});
