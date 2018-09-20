
define([
    'storage/thought-storage',
    'auth-service',
    'api/google-drive-api',
    'ui/spinner/site-global-loading-bar',
    'ui/ui-error-notification'
], function(
    thoughtStorage,
    authService,
    googleDriveApi,
    siteGlobalLoadingBar,
    uiErrorNotification
) {
    // Developer Console, https://console.developers.google.com
    var CLIENT_ID = '586695064067-2k8v88rq1litcqj8v0ofnstj6t6qfhpa.apps.googleusercontent.com';

    var SCOPES = [
        // Per-file access to files created or opened by the app
        'https://www.googleapis.com/auth/drive.file'
    ];

    var service = {
        checkAuth: checkAuth,
        gapiAuthorize: gapiAuthorize
    };

    return service;

    /**
     * Check if current user has authorized this application.
     */
    function checkAuth() {
      console.debug('googleLogin.checkAuth() (calling gapiAuthorize())');
      return gapiAuthorize().then(handleAuthResult);
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
                console.debug('googleLogin.gapiAuthorize(): authResult: ', authResult);
                if (authResult.error) {
                    uiErrorNotification.show('Google Authentification failed: ' +  authResult.error);
                    console.error('googleLogin.gapiAuthorize(): authError: ', authResult.error);
                    reject(authResult);
                } else {
                    console.debug('googleLogin.gapiAuthorize(): auth sucess! authResult: ', authResult);
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
      console.debug('googleLogin.handleAuthResult()');
      return new Promise(function(resolve, reject) {
          var authorizeDiv = document.getElementById('authorize-div');
          console.debug('authResult: ', authResult);
          if (authResult && !authResult.error) {
              authService.authResult = authResult;
              console.info('Google Auth success!');
              resolve(authResult);

          } else {
              console.error('googleLogin(): Google auth fail! Need to relogin manually.');
              reject(authResult);
            }
      });
    }

});
