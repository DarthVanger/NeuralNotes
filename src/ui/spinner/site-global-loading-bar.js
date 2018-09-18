define([ ], function() {
    var loading = [];

    var $backgroundSpinner = $('#background-spinner');
    var $loadersContainer =  $('#site-global-loading-bar-messages-container');
    var $loadingBar = $('#site-global-loading-bar');

    $loadingBar.hide();

    var $loadingMessageElement = $('<div class="site-global-loading-bar__message"></div>');

    var loaderInstances = [];

    var loadingBarService = {
        show: showLoadingBar,
        hide: hideLoadingBar,
        create: create,
    };

    var loaderInstance = function(name) {
    };

    return loadingBarService;

    function create(name) {
        var $msgEl = $loadingMessageElement.clone();
        $msgEl.append($('<div>Loading: ' + name + '</div>'));
        $msgEl.addClass('hidden-message');
        var isShown = false;
        var loaderInstance = {
            name: name,
            create: function(subName) {
                return loadingBarService.create(name + ' | ' + subName);
            },
            show: function() {

                if (!isShown) {
                    $loadersContainer.append($msgEl);
                }
                $msgEl.removeClass('hidden-message');

                showLoadingBar();
                isShown = true;
            },
            hide: function() {
                $msgEl.addClass('hidden-message');
                hideLoadingBar(name);
                var REMOVE_ANIMATION_DURATION = 2000;
                setTimeout(function() {
                    $msgEl.remove();
                }, REMOVE_ANIMATION_DURATION);
            }
        }
        loaderInstances.push(loaderInstance);
        return loaderInstance;
    }

    function showLoadingBar() {
        $loadingBar.show();
        $backgroundSpinner.addClass('show');
    }

    function hideLoadingBar(name) {
        $loadingBar.hide();
        $backgroundSpinner.removeClass('show');
    }

});
