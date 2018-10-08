console.debug('cloid-api-loader.js');
define([
    'api/google-drive-api',
    'ui/spinner/site-global-loading-bar',
    'api/google-login',
    'api/google-client-config',
    'auth'
], function(
    googleDriveApi,
    siteGlobalLoadingBar,
    googleLogin,
    googleClientConfig,
    auth
) {
    var clientId = googleClientConfig.clientId;
    var apiKey = googleClientConfig.apiKey;
    var scopes = googleClientConfig.scopes;
    var discoveryDocs = googleClientConfig.discoveryDocs;

    return {
        load: load
    };

    function load() {
        return loadGoogleClient();
    }


    /**
     * Load google api script. It can't be hosted
     * on a private server, so need to get it from google server.
     * Also init google client.
     *
     * @return {Promise}
     */
    function loadGoogleClient() {
        console.info('Loading Google Client...');
        var spinner = siteGlobalLoadingBar.create('login');
        var checkGapiSpinner = spinner.create('checking google login');
        return new Promise(function(resolve, reject) {
            require(
              ['https://apis.google.com/js/api.js'],
              // checkGAPI makes polling: calls itself until gapi is ready,
              // and then calls init().
              checkGAPI
            );

            // Poll until gapi is ready
            function checkGAPI() {
                console.debug('cloudApiLoader.checkGAPI()');
                checkGapiSpinner.show();
                if (gapi) {
                    console.info('[Loaded] Google API');
                    checkGapiSpinner.hide();

                    loadGoogleApiClient();
                } else {
                    setTimeout(checkGAPI, 100);
                }
            }

            function loadGoogleApiClient() {
                gapi.load('client:auth2', initClient);
                checkGapiClient();
            }
            
            function initClient() {
                console.debug('googleApiLoader.initClient()');
                gapi.client.init({
                    apiKey: apiKey,
                    discoveryDocs: discoveryDocs,
                    clientId: clientId,
                    scope: scopes
                });
            }

            function checkGapiClient() {
                console.debug('cloudApiLoader.checkGapiClient()');
                if (gapi.client) {
                    console.info('[Loaded] gapi.client');
                    onGapiClientInit();
                } else {
                    setTimeout(checkGapiClient, 100);
                }
            }

            function onGapiClientInit() {
                if (auth.signedIn()) {
                    gapi.client.setToken({
                      access_token: auth.getToken()
                    });
                }

                resolve();
            }
        });
    }

});
