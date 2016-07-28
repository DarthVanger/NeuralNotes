require.config({
    baseUrl: 'src/',
    paths: {
        text: "../bower_components/text/text",
        d3: "../bower_components/d3/d3"
    }
});

define([
    'router'
], function(
    router
) {


    $(document).ready(function() {
        console.debug('app start');

        console.debug('call router init');
        router.init();

    });

});
