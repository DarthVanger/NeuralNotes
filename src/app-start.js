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
    'spinner/site-global-loading-bar',
    'api/cloud-api-loader',
    'auth-service',
    'ui/app-root',

    // non-amd libs:
    'underscore',
    // add additional functionality to javascript native Promise.
    'utils/promise-patch'
], function(
    thoughtStorage,
    siteGlobalLoadingBar,
    cloudApiLoader,
    authService,
    appRootComponent,
    _underscore_undefined_,
    _promise_patch_undefined
) {

    $(document).ready(function() {
        console.info('Loading...');

        var apiLoadSpinner = siteGlobalLoadingBar.create('cloud-api');
        var cloudDriveSpinner = siteGlobalLoadingBar.create('cloud-drive');

        apiLoadSpinner.show();
        cloudApiLoader
            .load()
            .finally(function() {
                apiLoadSpinner.hide();
            })
            .then(function() {
                cloudDriveSpinner.show();
                return thoughtStorage.scanDrive();
            })
            .finally(function() {
                cloudDriveSpinner.hide();
            })
            .then(function() {
                appRootComponent.render();
            });
    });

});
