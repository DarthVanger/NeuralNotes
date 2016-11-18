define([], function() {
    var loading = [];
    var $loadersContainer =  $('#site-global-loading-bar-messages-container');
    var $loadingBar = $('#site-global-loading-bar');

    // loading bar is hidden by default, obviously :)
    $loadingBar.hide();

    var $loadingMessageElement = $('<div class="site-global-loading-bar__message"></div>');
    console.debug('site-global-loading-bar: $loadingMessageElement: ', $loadingMessageElement);

    var loaderInstances = [];

    var loadingBarService = {
        // easy show/hide, without creating named instance
        show: showLoadingBar,
        hide: hideLoadingBar,
        // create named instance of a loader
        create: create,
    };

    var loaderInstance = function(name) {
    };

    return loadingBarService;

    function create(name) {
        console.debug('site-global-loading-bar: creating loader for name: ', name);
        var $msgEl = $loadingMessageElement.clone();
        $msgEl.append($('<div>' + name + '</div>'));
        $msgEl.addClass('hidden-message');
        var isShown = false;
        var loaderInstance = {
            name: name,
            create: function(subName) {
                return loadingBarService.create(name + ' | ' + subName);
            },
            show: function() {
                console.debug('site-global-loading-bar: showing message element for message: ', name);

                if (!isShown) {
                    console.debug('site-global-loading-bar: appending message element for message: ', name);
                    $loadersContainer.append($msgEl);
                }
                $msgEl.removeClass('hidden-message');

                showLoadingBar();
                isShown = true;
            },
            hide: function() {
                console.debug('site-global-loading-bar: removing message element for message:', name);
                $msgEl.addClass('hidden-message');
                hideLoadingBar(name);
                // remove element after css animation.
                var REMOVE_ANIMATION_DURATION = 2000;
                setTimeout(function() {
                    $msgEl.remove();
                }, REMOVE_ANIMATION_DURATION);
                //loaderInstances.splice(loaderInstances.indexOf(loaderInstance, 1));
            }
        }
        loaderInstances.push(loaderInstance);
        console.debug('loadingBar: loader intances: ', loaderInstances);
        return loaderInstance;
    }

    function showLoadingBar() {
        console.debug('site-global-loading-bar: showLoadingBar()');
        $loadingBar.show();
    }

    function hideLoadingBar(name) {
        console.debug('site-global-loading-bar: hideLoadingBar()');
        $loadingBar.hide();
    }

});
