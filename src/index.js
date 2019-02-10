require('vis/dist/vis.css');

require('bootstrap/dist/css/bootstrap.min.css');
require('font-awesome/css/font-awesome.css');
require('bootstrap-social/bootstrap-social.css');

require.config({
    baseUrl: 'src/',
    paths: {
        text: "../bower_components/text/text",
        d3: "../bower_components/d3/d3",
        //lodash: "../bower_components/lodash/lodash"
        underscore: "../bower_components/underscore/underscore"
    },
    shim: {
       underscore: {
          exports: '_'
       }
    }
});

define([
    'storage/thought-storage',
    'ui/spinner/site-global-loading-bar',
    'api/google-api-loader',
    'ui/app-root',
    'api/google-login',
    'auth',
    'api/google-drive-api',

    // non-amd libs:
    'underscore',
    // add additional functionality to javascript native Promise.
    'utils/promise-finally'
], function(
    thoughtStorage,
    siteGlobalLoadingBar,
    googleApiLoader,
    appRootComponent,
    googleLogin,
    auth,
    googleDriveApi,
    _underscore_undefined_,
    _promise_patch_undefined
) {
    var spinner = siteGlobalLoadingBar.create();

    run();

    function run() {
        if (auth.signedIn()) {
            console.info('User is signed in');
            loadApp();
        } else {
            appRootComponent.render({
                page: 'login'
            });
        }
    }

    function loadApp() {
        console.info('Loading app...');
        spinner.show('Loading Google Api');

        googleApiLoader
            .load()
            .then(googleDriveApi.loadDriveApi)
            .then(function() {
                return thoughtStorage.scanDrive()
            })
            .then(function() {
                appRootComponent.render({
                    page: 'notes'
                });
            })
            .finally(function() {
                spinner.hide();
            });
    }
});
