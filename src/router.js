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

    function goToRoute(route) {
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

        $siteContainer.empty();
        $siteContainer.append(template);
        
        console.debug('controllerPath: ', controllerPath);
        if (controllerPath.length > 0) {
            require([controllerPath], function(controller) {
                controller.init();
            });
        }

        window.location.hash = route;
    }

});
