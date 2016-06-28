require.config({
    paths: {
        text: "../bower_components/text/text"
    }
});

define(['text!thought/create-thought/create-thought.html'], function(createThoughtTemplate) {

    $(document).ready(function() {
        console.debug('app start');
        
        $('.site-content').append(createThoughtTemplate);

    });
});
