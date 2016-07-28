define([
    'auth-service'
], function(
    authService
) {

    var client;

    return {
        loadDriveApi: loadDriveApi,
        client: client
    };

    /**
     * Load Drive API client library.
     */
    function loadDriveApi() {
        var promise = new Promise(function(resolve, reject) {
              gapi.client.load('drive', 'v3', function() {
                  client = gapi.client.drive;
                  console.debug('loadDriveApi: resolving promise');
                  resolve();
              });
        });

        return promise;
    }

});
