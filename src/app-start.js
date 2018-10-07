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
    _underscore_undefined_,
    _promise_patch_undefined
) {
    var spinner = siteGlobalLoadingBar.create();

    run();

    function run() {
        console.info('Loading app...');

        if (auth.signedIn()) {
            loadApp();
        } else {
            appRootComponent.render({
                page: 'login'
            });
        }
    }

    function loadApp() {
        spinner.show('Loading Google Api');

        googleApiLoader
            .load()
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
