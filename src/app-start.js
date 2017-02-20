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
    'router',
    'thought/thought-storage',
    'spinner/site-global-loading-bar',
    'api/cloud-api-loader',

    // non-amd libs:
    'underscore',
    // add additional functionality to javascript native Promise.
    'utils/promise-patch'
], function(
    router,
    thoughtStorage,
    siteGlobalLoadingBar,
    cloudApiLoader,
    _underscore_undefined_,
    _promise_patch_undefined
) {

    $(document).ready(function() {
        var debug = true;

        if (!debug) {
            console.debug = function() { };
        }

        console.debug('app start');

        console.debug('call router init');

        router.init();

        var spinner = siteGlobalLoadingBar.create('app-start');

        if (thoughtStorage.restoreFromCache()) {
            console.debug('appStart(): cache restored, calling router.goToRouteInAddressBar()');
            cloudApiLoader.loadInBackground();
            router.goToRouteInAdressBar();
            //router.go('view-thoughts');

        } else {
            console.debug('appStart(): no cache found, loading google client');
            //loadGoogleClient();
        }

    });

});
