define([
    'text!thought/create-thought/create-thought.html',
    'text!thought/view-thoughts/view-thoughts.html',
    'text!login.html'
], function(
    createThoughtTemplate,
    viewThoughtsTemplate,
    loginTemplate
) {
    var router = {
        init: init,
        goToRoute: goToRoute,
        go: goToRoute,
        goToRouteInAdressBar: goToRouteInAdressBar
    };

    return router;
    
    function init() {
        goToRouteInAdressBar();
        setRouterLinkListeners();
    }

    function goToRouteInAdressBar() {
        var route = window.location.hash.slice(1);
        goToRoute(route);
    }

    function setRouterLinkListeners() {
        $('[data-router-link]').on('click', function(event) {
            event.preventDefault();

            var $element = $(event.target);
            var href = $element.attr('href');
            var route = href.slice(1);

            goToRoute(route);

            return false;
        });
    }

    function goToRoute(route, options) {
        console.debug('route: ', route);
        var $siteContainer = $('.site-content');
        var template;
        var controllerPath;
        switch (route) {
            case 'login':
                template = loginTemplate;
                controllerPath = 'login';
                break;
            case 'create-thought':
                template = createThoughtTemplate;
                controllerPath = 'thought/create-thought/create-thought';
                break;
            case 'view-thoughts':
                template = viewThoughtsTemplate;
                controllerPath = 'thought/view-thoughts/view-thoughts';
                break;
            default: 
                template = loginTemplate;
                controllerPath = 'login';
                break;
        }
        
        console.debug('controllerPath: ', controllerPath);
        if (controllerPath.length > 0) {
            // dynamically load controller file, and
            // call its init() function.
            require([controllerPath], function(controller) {
                console.log('router: calling controller init');
                controller.init(options);
                controller.templateData = controller.templateData || { };
                console.log('controllerTemplateData: ', controller.templateData);
                compiledTemplate = _.template(template)(controller.templateData);

                // TODO: do something with this :P
                $siteContainer.empty();
                $siteContainer.append(compiledTemplate);

                if (controller.onRender) {
                    controller.onRender();
                }

            });
        }

        window.location.hash = route;
    }

});
