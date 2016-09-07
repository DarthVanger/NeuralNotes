define([
    'thought/thought-storage',
    'router',
    'auth-service'
], function(
    thoughtStorage,
    router,
    authService
) {

    return {
        init: init
    };

    function init(options) {
        if (!authService.authResult) {
            router.go('/');
            return;
        }

        console.log('create-thought.init(). options: ', options);

        var $form = $('.create-thought-form');
        var $thoughtContent = $form.find('[name="thoughtContent"]');
        var $thoughtName = $form.find('[name="thoughtName"]');
        $form.on('submit', function(event) {
            event.preventDefault();
            var thoughtName = $thoughtName.val();
            var thoughtContent = $thoughtContent.val();
            console.debug('thoughtName: ', thoughtName);
            console.debug('thoughtContent: ', thoughtContent);

            var thought = {
                name: thoughtName,
                content: thoughtContent
            };

            thoughtStorage.save(thought, options.parentThought).then(function() {
                router.go('view-thoughts');
            });

            return false;
        });
    }
});
