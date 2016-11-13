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
    'underscore',
    // add additional functionality to javascript native Promise.
    'utils/promise-patch'
], function(
    router,
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

    });

});
