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
                "name": "test.txt",
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

        function updateFile(newFile) {
            console.debug('updateFile()');

            console.debug('newFile: ', newFile);
            var request = googleDriveApi.client.files.update(
                {
                    fileId: newFile.id,
                    name: 'test-updated3.txt',
                    uploadType: 'media'
                },
                btoa('content plzzzz ;))')
            );
            console.debug('request: ', request);

            var promise = new Promise(function(resolve, reject) {
                console.debug('executing request');
                request.execute(function(resp) {
                    console.debug('resolving resp');
                    resolve(resp);
                });
            });

            return promise;
        }

    };
});
