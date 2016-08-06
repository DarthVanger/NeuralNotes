define([
    'google-drive-api'
], function(
    googleDriveApi
) {
    'use strict';

    return {
        save: save
    };

    // this guy from stackoverflow is a GOD! :)
    // http://stackoverflow.com/a/10323612/1657101
    function save(thought) {
        console.debug('thoughtStorage.save(). Thought: ', thought);
        console.debug('googleDriveApi: ', googleDriveApi);


        createEmptyFile()
            .then(function(newFile) {
                console.debug('created new file! :) ', newFile);
                return updateFile(newFile); 
            })
            .then(function(updatedFile) {
                console.debug('updated file: ', updatedFile);
            });


        function createEmptyFile() {
            console.debug('createEmptyFile()');
            var request = googleDriveApi.client.files.create({
                "name": thought.name + '.txt',
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

        function updateFile(createdFile) {
            console.debug('updateFile()');
            var request = gapi.client.request({
                path: '/upload/drive/v3/files/' + createdFile.id,
                method: 'PATCH',
                params: {
                    uploadType: 'media'
                },
                body: thought.content 
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

    };
});
