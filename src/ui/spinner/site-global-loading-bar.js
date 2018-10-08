define([ ], function() {
    var loading = [];

    var backgroundSpinner = document.getElementById('background-spinner');
    var loadersContainer =  document.getElementById('site-global-loading-bar-messages-container');
    var loadingBar = document.getElementById('site-global-loading-bar');

    hideLoadingBar();

    var loadingMessageElement = document.createElement('div');
    loadingMessageElement.className = 'site-global-loading-bar__message';

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
        var msgEl = loadingMessageElement.cloneNode(true);
        msgEl.innerText = 'Loading: ' + name;
        msgEl.classList.add('hidden-message');

        /**
         * Show loading message, only if spinner takes more
         * than the specified time.
         * (to not annoy user with messages on every quick action)
         */
        var showDelay = 2000;

        var isShown = false;
        var timeoutId;
        var loaderInstance = {
            name: name,
            create: function(subName) {
                return loadingBarService.create(name + ' | ' + subName);
            },
            show: function() {
                showLoadingBar();
                timeoutId = setTimeout(function() {
                    if (!isShown) {
                        loadersContainer.append(msgEl);
                    }
                    msgEl.classList.remove('hidden-message');
                    isShown = true;
                }, showDelay);
            },
            hide: function() {
                window.clearTimeout(timeoutId);
                msgEl.classList.add('hidden-message');
                hideLoadingBar(name);
                var REMOVE_ANIMATION_DURATION = 2000;
                setTimeout(function() {
                    msgEl.remove();
                }, REMOVE_ANIMATION_DURATION);
            }
        }
        loaderInstances.push(loaderInstance);
        return loaderInstance;
    }

    function showLoadingBar() {
        loadingBar.style.display = 'block';
        backgroundSpinner.classList.add('show');
    }

    function hideLoadingBar(name) {
        loadingBar.style.display = 'none';
        backgroundSpinner.classList.remove('show');
    }

});
