define([
    'auth-service'
], function(
    authService
) {

    var client;

    var self = {
        loadDriveApi: loadDriveApi,
        client: client
    };

    return self;

    /**
     * Load Drive API client library.
     */
    function loadDriveApi() {
        var promise = new Promise(function(resolve, reject) {
              gapi.client.load('drive', 'v3', function() {
                  self.client = gapi.client.drive;
                  console.debug('loadDriveApi: resolving promise');
                    console.debug('googleDriveApi.client.files: ', self.client.files);
                  resolve();
              });
        });

        return promise;
    }

});
