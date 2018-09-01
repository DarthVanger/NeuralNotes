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
    'thought/thought-storage/thought-storage',
    'spinner/site-global-loading-bar',
    'api/cloud-api-loader',
    'auth-service',
    'thought/thought-storage/thought-storage',

    // non-amd libs:
    'underscore',
    // add additional functionality to javascript native Promise.
    'utils/promise-patch'
], function(
    router,
    thoughtStorage,
    siteGlobalLoadingBar,
    cloudApiLoader,
    authService,
    thoughtStorage,
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
            cloudApiLoader.load()
                .then(thoughtStorage.scanDrive)
                .then(router.goToRouteInAdressBar);
    });

});
