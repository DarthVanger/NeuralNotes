define([
    'google-drive-api'
], function(
    googleDriveApi
) {
    'use strict';

    return {
        save: save
    };

    function save(thought) {
        console.debug('thoughtStorage.save(). Thought: ', thought);
        console.debug('googleDriveApi: ', googleDriveApi);
        return createFile(thought.name + '.txt', thought.content);
    };

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

    function createEmptyFile(filename) {
        console.debug('createEmptyFile()');
        var request = googleDriveApi.client.files.create({
            "name": filename,
            "mimeType": "text/plain",
            "description": "test file"
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
