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
    'auth-service',

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

        // Temporary disabled restoring from cache,
        // because getting thought contents requires
        // gapi to be already loaded (it's not cahced yet),
        // so it throws undefined,
        // if we restore from cache and call it before
        // gapi was loaded
        // TODO: store thought contents in cache also
        // (or make getting thought contents wait for gapi
        // to be loaded, and make requests only after that)
        if (false && thoughtStorage.restoreFromCache()) {
            console.debug('appStart(): cache restored, calling router.goToRouteInAddressBar()');
            cloudApiLoader.load();
            router.goToRouteInAdressBar();
            //router.go('view-thoughts');

        } else {
            console.debug('appStart(): no cache found, loading google client...');
            cloudApiLoader.load()
                .then(function() {
                    console.debug('appStart(): google client loaded, checking auth');
                    if (authService.isAuthorized()) {
                        console.debug('appStart(): user is authorized, reading thoughts from google drive');    
                        
                        thoughtStorage.scanDrive()
                            .then(function() {
                                console.debug('appStart(): thoughts loaded from google drive, going to route in address bar');

                                router.goToRouteInAdressBar();
                            });
                    } else {
                        console.debug('appStart(): user is NOT authorized');    
                    }
                });
        }

    });

});
