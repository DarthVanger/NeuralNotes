define([
    'google-drive-api'
], function(
    googleDriveApi
) {

    return {
        save: save
    };

    function save(thought) {
        console.debug('thoughtStorage.save(). Thought: ', thought);
        console.debug('googleDriveApi: ', googleDriveApi);
        var request = googleDriveApi.client.files.create({
            "title": "test.txt",
            "mimeType": "text/plain",
            "description": "test file"
        });


        var promise = new Promise(function(resolve, reject) {
            request.execute(function(newFile) {
                resolve(newFile);
            });
        });

        promise.then(function(newFile) {
            console.debug('created new file! :) ', newFile);
        });
    };
});
