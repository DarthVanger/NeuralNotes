define([
    'thought/thought-storage',
    'router',
    'auth-service'
], function(
    thoughtStorage,
    router,
    authService
) {
    var controller = {
        init: init,
        templateData: {},
        onRender: onRender
    };

    var self = controller;

    return controller;

    function init(options) {
        if (!authService.authResult) {
            router.go('/');
            return;
        }

        self.templateData.parentThought = options.parentThought;

        console.log('create-thought.init(). options: ', options);
        self.options = options;
    }

    function onRender() {
        console.log('create-thought.onRender()');
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

            thoughtStorage.save(thought, self.options.parentThought).then(function(newThought) {
                if (self.options.parentThought.children) {
                    self.options.parentThought.children = [];
                }
                thought.id = newThought.id;
                self.options.parentThought.children.push(thought);
                goBack();
            });

            return false;
        });

        var $backButton = $('[data-action="goBack"]').on('click', function() {
            goBack();
        });
    }

    function goBack() {
        router.go('view-thoughts', { thought: self.options.parentThought });
    }

});
