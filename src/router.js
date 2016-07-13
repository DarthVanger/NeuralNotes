define([
    'text!thought/create-thought/create-thought.html',
    'text!thought/view-thoughts/view-thoughts.html',
], function(
    createThoughtTemplate,
    viewThoughtsTemplate
) {
    var router = {
        init: init,
        goToRoute: goToRoute,
        goToRouteInAdressBar: goToRouteInAdressBar
    };

    return router;
    
    
    function init() {
        goToRouteInAdressBar();
        setRouterLinkListeners();
    }

    function goToRouteInAdressBar() {
        var route = window.location.href.slice(1);
        if (route.length > 0) {
            goToRoute(route);
        }
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
        $('.create-thought').empty();
        $('.view-thoughts').empty();
        switch (route) {
            case 'create-thought':
                $('.create-thought').append(createThoughtTemplate);
                break;
            case 'view-thoughts':
                $('.view-thoughts').append(viewThoughtsTemplate);
                break;
            default: 
                $('.view-thoughts').append(viewThoughtsTemplate);
                break;
        }

        window.location.hash = route;
    }

});
