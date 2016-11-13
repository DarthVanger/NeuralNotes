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
        goToRouteInAdressBar: goToRouteInAdressBar
    };

    return router;
    
    function init() {
        goToRouteInAdressBar();
        setRouterLinkListeners();
    }

    function goToRouteInAdressBar() {
        var route = window.location.hash.slice(1);
        var routeName = route.split('/')[0];
        var urlOptions = route.split('/').slice(1);
        goToRoute(route, null, urlOptions);
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
    function goToRoute(route, options, urlOptions) {
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

                if (urlOptions && urlOptions.length > 0) {
                    console.log('urlOptions: ', urlOptions);
                    options.thoughtId = urlOptions[0];
                }

                if (options && options.thought) {
                    console.log('window.location.hash: ', window.location.hash);
                    routeWithOptions = route + '/' + options.thought.id;
                    console.log('window.location.hash: ', window.location.hash);
                }

                break;
            default: 
                template = loginTemplate;
                controllerPath = 'login';
                break;
        }

        console.debug('controllerPath: ', controllerPath);
        if (controllerPath.length > 0) {
            // dynamically load controller file, and
            // call its init() function,
            // passing `options` param to it.
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

        window.location.hash = routeWithOptions;
    }

});
