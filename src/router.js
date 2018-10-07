define([
   'ui/app-root'
], function(
    appRootComponent
) {
    return {
        go: go
    };

    function go(page) {
        throw new Error('Oops, circular dependency. Needs fixing! :)');
        appRootComponent.render({
            page: page
        })
    }
});

