define([
    'text!thought/create-thought/create-thought.html',
    'text!thought/view-thoughts/view-thoughts.html',
    'text!login.html'
], function(
    createThoughtTemplate,
    viewThoughtsTemplate,
    loginTemplate
) {
    var routeWithOptions;

    var router = {
        init: init,
        goToRoute: goToRoute,
        go: goToRoute,
        goToRouteInAdressBar: goToRouteInAdressBar,
        currentRoute: undefined
    };

    return router;
    
    function init() {
        setRouterLinkListeners();
    }

    function readRouteFromAddressBar() {
        return window.location.hash.slice(1);
        //var routeName = route.split('/')[0];
    }

    function goToRouteInAdressBar() {
        console.debug('router.goToRouteInAdressBar()');
        var route = readRouteFromAddressBar();
        console.debug('router: going to url "' + route + '"');
        goToRoute(route);
    }

    /**
     * Adds click listeners to elemtns with [data-router-link]
     * attribute.
     * Reads the `href` attribute as a route.
     */
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

    /**
     * Loads controller and view for a route,
     * calls controller.init(options) method.
     * @param {String} route - Route, one of defined below.
     * @param {Object} options - Options that might be passed for the route,
     * when going to a route pragrammaitcally.
     * They will be passed to controller.init(options) method.
     * @param {Array} urlOptions - Options for the route, read from url.
     */
    function goToRoute(route, options) {
        console.debug('router.goToRoute(). route: ', route);
        var $siteContainer = $('.site-content');
        var template;
        var controllerPath;
        var routes = [
            {
                url: 'login',
                template: loginTemplate,
                controllerPath: 'login'
            },
            {
                url: 'create-thought',
                template: createThoughtTemplate,
                controllerPath: 'thought/create-thought/create-thought'
            },
            {
                url: 'view-thoughts',
                template: viewThoughtsTemplate,
                controllerPath: 'thought/view-thoughts/view-thoughts',
            }
        ];

        console.debug('router: routes config: ', routes);

        var routeConfig = _.find(routes, { url: route });

        if (!routeConfig) {
            var defaultRoute = 'view-thoughts';
            console.debug('router: route config for "' + route + '" not found, using default route "' + defaultRoute + '"');
            routeConfig = _.find(routes, { url: defaultRoute });
        }

        console.debug('router: using route config: ', routeConfig);

        console.debug('routeConfig.controllerPath: ', routeConfig.controllerPath);

        if (!routeConfig.controllerPath) {
            throw new Error('Router: controllerPath is empty');
        }

        // dynamically load controller file, and
        // call its init() function,
        // passing `options` param to it.
        require([routeConfig.controllerPath], function(controller) {
            console.debug('router: calling init for controller: ', controller);
            controller.init(options);
            controller.templateData = controller.templateData || { };
            console.debug('controllerTemplateData: ', controller.templateData);
            compiledTemplate = _.template(routeConfig.template)(controller.templateData);

            // TODO: do something with this :P
            $siteContainer.empty();
            $siteContainer.append(compiledTemplate);

            if (controller.onRender) {
                controller.onRender();
            }

        });
    }

});
