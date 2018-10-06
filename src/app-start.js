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
    'api/cloud-api-loader',
    'ui/app-root',

    // non-amd libs:
    'underscore',
    // add additional functionality to javascript native Promise.
    'utils/promise-finally'
], function(
    thoughtStorage,
    siteGlobalLoadingBar,
    cloudApiLoader,
    appRootComponent,
    _underscore_undefined_,
    _promise_patch_undefined
) {

    run();

    function run() {
        console.info('Loading app...');

        var spinner = siteGlobalLoadingBar.create();

        spinner.show('Loading Google Api');

        cloudApiLoader
            .load()
            .finally(function() {
                spinner.hide();
            })
            .then(function() {
                spinner.show('Scanning Google Drive');
                return thoughtStorage.scanDrive();
            })
            .finally(function() {
                spinner.hide();
            })
            .then(function() {
                appRootComponent.render();
            });
    }
});
