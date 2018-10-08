
define([
    'storage/thought-storage',
    'api/google-drive-api',
    'ui/spinner/site-global-loading-bar',
    'ui/ui-error-notification',
    'auth',
    'api/google-client-config'
], function(
    thoughtStorage,
    googleDriveApi,
    siteGlobalLoadingBar,
    uiErrorNotification,
    auth,
    googleClientConfig
) {
    var clientId = googleClientConfig.clientId;
    var scopes = googleClientConfig.scopes;

    var service = {
        checkAuth: checkAuth,
        gapiAuthorize: gapiAuthorize
    };

    return service;

    /**
     * Check if current user has authorized this application.
     */
    function checkAuth() {
        console.debug('googleLogin.checkAuth()');
        console.log('googleLogin.checkAuth() (calling gapiAuthorize())');
        return new Promise(function(resolve, reject) {
            if (!auth.haveToken()) {
                console.info('User token expired, authorize again');
                gapiAuthorize().then(resolve);
            } else {
                console.info('User token is still valid');
                gapi.client.setToken({
                  access_token: auth.getToken()
                });

                resolve();
            }
        });
    }

    function updateSigninStatus(isSignedIn) {
      if (isSignedIn) {
        console.info('User is signed in');
      } else {
        console.info('User NOT signed in');
          gapiAuthorize();
      }
    }

    function gapiAuthorize() {
        console.debug('googleLogin.gapiAuthorize(): clientId: ', clientId);
        console.debug('googleLogin.gapiAuthorize(): scopes: ', scopes);
        return new Promise(function(resolve, rejct) {
            gapi.auth.authorize({
                client_id: clientId,
                scope: scopes.join(' '),
                immediate: false
            }, function(authResult) {
                console.debug('googleLogin.gapiAuthorize(): authResult: ', authResult);
                if (authResult.error) {
                    uiErrorNotification.show('Google Authentification failed: ' +  authResult.error);
                    console.error('googleLogin.gapiAuthorize(): authError: ', authResult.error);
                    reject(authResult);
                } else {
                    auth.saveToken({
                        access_token: authResult.access_token,
                        expires_in: authResult.expires_in
                    });

                    console.debug('googleLogin.gapiAuthorize(): auth sucess! authResult: ', authResult);
                    resolve(authResult);
                }
            });
        });
    }
});
