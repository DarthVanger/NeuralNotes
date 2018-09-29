
define([
    'storage/thought-storage',
    'api/google-drive-api',
    'ui/spinner/site-global-loading-bar',
    'ui/ui-error-notification',
    'auth'
], function(
    thoughtStorage,
    googleDriveApi,
    siteGlobalLoadingBar,
    uiErrorNotification,
    auth
) {
    // Developer Console, https://console.developers.google.com
    var clientId = '586695064067-2k8v88rq1litcqj8v0ofnstj6t6qfhpa.apps.googleusercontent.com';

    var apiKey = 'AIzaSyAPXuniw1OFvl6OgeIuZp3NSbqfrjnw8qA';

    var scopes = [
        // Per-file access to files created or opened by the app
        'https://www.googleapis.com/auth/drive.file'
    ];

    var discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

    var checkAuthPromiseResolve;

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
      //return gapiAuthorize().then(handleAuthResult);
      return new Promise(function(resolve, reject) {
          gapi.load('client:auth2', initClient);
          checkGapiClient();
          
          function initClient() {
              console.info('initClient()');
              gapi.client.init({
                  apiKey: apiKey,
                  discoveryDocs: discoveryDocs,
                  clientId: clientId,
                  scope: scopes
              });
          }

          checkAuthPromiseResolve = resolve;
      });
    }

    function onGapiClientInit() {
        console.info('Gapi client initialized');
        if (!auth.haveToken()) {
            console.info('User token expired, authorize again');
            gapiAuthorize().then(checkAuthPromiseResolve);
        } else {
            console.info('User token is still valid');
            gapi.client.setToken({
              access_token: auth.getToken()
            });

            checkAuthPromiseResolve();
        }
    }

    function checkGapiClient() {
        console.debug('cloudApiLoader.checkGapiClient()');
        if (gapi.client) {
            console.debug('gapi.client loaded!', gapi.client);
            console.debug('checkGapiSpinner.hide()');
            onGapiClientInit();
            
        } else {
            setTimeout(checkGapiClient, 100);
        }
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
                //scope: scopes,
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
