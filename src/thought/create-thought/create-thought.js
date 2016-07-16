define([
], function(
) {

    return {
        init: init
    };

    function init() {
        var $form = $('.create-thought-form');
        var $thoughtContents = $form.find('[name="thoughtContents"]');
        $form.on('submit', function(event) {
            event.preventDefault();
            var thoughtContents = $thoughtContents.val();
            console.debug('thoughtContents: ', thoughtContents);



            return false;
        });
    }
});
