console.debug('cloid-api-loader.js');
define([
    //'thought/thought-storage',
    //'router',
    //'auth-service',
    'google-drive-api',
    'spinner/site-global-loading-bar',
    'api/google-login'
], function(
    //thoughtStorage,
    //router,
    //authService,
    googleDriveApi,
    siteGlobalLoadingBar,
    googleLogin
) {
    var service = {
        loadInBackground: loadInBackground
    };

    return service;

    function loadInBackground() {
        loadGoogleClient()
            .then(googleLogin.checkLogin)
            .then(googleDriveApi.loadDriveApi, loginFail) 
            .then(driveApiLoadSuccess, driveApiLoadFail);

        function driveApiLoadSuccess() {
            console.debug('cloudApiLoader.driveApiLoadSuccess()');
        }

        function driveApiLoadFail() {
            console.error('cloudApiLoader: Google Drive Api load failed!');
        }

        function loginFail() {
            console.info('cloudApiLoader: auto-login failed, user needs to relogin');
        }
    }


    /**
     * Load google client script. It can't be hosted
     * on private server, so need to get it from google server.
     *
     * @return {Promise}
     */
    function loadGoogleClient() {
        var spinner = siteGlobalLoadingBar.create('login');
        var checkGapiSpinner = spinner.create('checking google login');
        return new Promise(function(resolve, reject) {
            require(
              ['https://apis.google.com/js/client.js?onload=doNothing"'],
              // checkGAPI makes polling: calls itself until gapi is ready,
              // and then calls init().
              checkGAPI
            );

            // Poll until gapi is ready
            function checkGAPI() {
                console.debug('checkGAPI()');
                checkGapiSpinner.show();
                if (gapi && gapi.client) {
                    console.debug('checkGapiSpinner.hide()');
                    checkGapiSpinner.hide();
                    resolve();
                } else {
                    setTimeout(checkGAPI, 100);
                }
            }
        });
    }

});
