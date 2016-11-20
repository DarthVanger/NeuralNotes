
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
      return new Promise(function(resolve, reject) {
          gapi.auth.authorize(
            {
              'client_id': CLIENT_ID,
              'scope': SCOPES.join(' '),
              'immediate': true
            }, function() {
                handleAuthResult.then(resolve);
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
