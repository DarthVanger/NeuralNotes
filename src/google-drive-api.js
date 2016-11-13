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
              //gapi.client.load('drive', 'v3', function() {
              gapi.client.load('drive', 'v3').then(function() {
                  self.client = gapi.client.drive;
                  console.debug('loadDriveApi(): load API success');
                  console.debug('loadDriveApi(): googleDriveApi.client.files: ', self.client.files);
                  resolve();
              }, function onError(error) {
                  //TODO: show user a notification that drive API failed.
                  throw error;
              });
        });

        return promise;
    }

});
