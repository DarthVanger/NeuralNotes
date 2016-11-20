
define([
    'thought/thought-storage',
    'router',
    'auth-service',
    'google-drive-api',
    'spinner/site-global-loading-bar'
], function(
    thoughtStorage,
    router,
    authService,
    googleDriveApi,
    siteGlobalLoadingBar
) {
    // Developer Console, https://console.developers.google.com
    var CLIENT_ID = '586695064067-2k8v88rq1litcqj8v0ofnstj6t6qfhpa.apps.googleusercontent.com';

    var SCOPES = [
        // Per-file access to files created or opened by the app
        'https://www.googleapis.com/auth/drive.file',
        // Allows read-only access to file metadata and file content
        'https://www.googleapis.com/auth/drive.readonly'
    ];

    var service = {
        checkAuth: checkAuth
    };

    return service;

    /**
     * Check if current user has authorized this application.
     */
    function checkAuth() {
      console.debug('googlLogin.checkAuth()');
      console.debug('checkAuth()');
      return garpiAuthorize.then(handleAuthResult);
    }

    function gapiAuthorize() {
        console.debug('googleLogin.gapiAuthorize(): CLIENT_ID: ', CLIENT_ID);
        console.debug('googleLogin.gapiAuthorize(): SCOPES: ', SCOPES);
        return new Promise(function(resolve, rejct) {
            gapi.auth.authorize({
                client_id: CLIENT_ID,
                scope: SCOPES.join(' '),
                //scope: SCOPES,
                immediate: false
            }, function(authResult) {
                if (authResult.error) {
                    reject(authResult);
                } else {
                    resolve(authResult);
                }
            });
        });
    }

    /**
     * Handle response from authorization server.
     *
     * @param {Object} authResult Authorization result.
     */
    function handleAuthResult(authResult) {
      return new Promise(function(resolve, reject) {
          var authorizeDiv = document.getElementById('authorize-div');
          console.debug('authResult: ', authResult);
          if (authResult && !authResult.error) {
              authService.authResult = authResult;
              resolve(authResult);

          } else {
              console.debug('googleLogin(): Google auth fail! Need to relogin manually.');
              reject(authResult);
            }
      });
    }

});
