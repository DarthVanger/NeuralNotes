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
    'underscore'
], function(
    router,
    _underscore_undefined_
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
