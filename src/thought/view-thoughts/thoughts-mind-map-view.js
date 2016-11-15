console.debug('thoughts-mind-map-view.js');
define([
    'router',
    'thought/view-thoughts/context-menu',
    'thought/view-thoughts/brain-vis-network',
    'thought/view-thoughts/vis-network-helper',
    'thought/thought-storage',
    'spinner/site-global-loading-bar',
], function(
    router,
    ContextMenu,
    BrainVisNetwork,
    VisNetworkHelper,
    thoughtStorage,
    siteGlobalLoadingBar
) {
    var visNetworkHelper;
    var thoughts = [];
    var currentViewedThought;

    var spinner = siteGlobalLoadingBar.create('thoughts-view');

    return {
        set: set,
        render: render
    };

    /**
     * Set thoughts and selectedThought.
     * @param {Array} options.thoughts - Array of thoughts to render.
     * @param {String} options.selectedThoughtId - Id of thought that should be in focus (center).
     */
    function set(options) {
        thoughts = options.thoughts;
        console.log('options.selectedThoughtId: ', options.selectedThoughtId);
        currentViewedThought = options.selectedThought || thoughts[0];
        console.log('currentViewedThought: ', currentViewedThought);
    }
    
    /**
     * Create new vis network for thoughts.
     * (Erases the old one).
     */
    function render() {
        console.debug('redner!');
        console.debug('thoughts: ', thoughts);

        console.debug('thoughts-mind-map-view: initializing brainVisNetwork');
        var brainVisNetwork = new BrainVisNetwork();
        console.debug('thoughts-mind-map-view: brainVisNetwork instance: ', brainVisNetwork);
        brainVisNetwork.renderInitialThought(currentViewedThought);
        //var visNetwork = renderVisNetworkForOneThought(currentViewedThought);
        console.log('brainVisNetwork: ', brainVisNetwork);
        visNetworkHelper = new VisNetworkHelper(brainVisNetwork.visNetwork);
        brainVisNetwork.visNetwork.on('click', changeThought);

        initializeAddThoughtButton(brainVisNetwork.visNetwork);
    }

    /**
     * Load child thoughts for clicked thought, 
     * and redraw the network for new thoughts.
     */
    function changeThought(event) {
        if (visNetworkHelper.clickedOnThought(event)) {
            console.log('change thought!');
            var targetThoughtId = visNetworkHelper.getTargetThoughtId(event);

            // if clicking on the current thought, do nothing.
            if (targetThoughtId === currentViewedThought.id) {
                return;
            }

            var visibleThoughts = currentViewedThought.children.concat([currentViewedThought.parent]);
            var targetThought = _.findWhere(visibleThoughts, { id: targetThoughtId });
            console.log('targetThoughtId: ', targetThoughtId);
            console.log('targetThought: ', targetThought);

            if (!targetThought) throw new Error('Target thought not found');
            var fetchingThoughtsSpinner = spinner.create('loading child thoughts');
            fetchingThoughtsSpinner.show();
            thoughtStorage.fetchChildThoughts(targetThoughtId)
                .then(function(children) {
                    console.log('fetched child thoughts: ', children);
                    targetThought.children = children;
                    currentViewedThought = targetThought;
                    $('[date-text="currentViewedThought"]').html(currentViewedThought.name);
                    render();
                    //renderVisNetworkForOneThought(targetThought);
                })
                .finally(function() {
                    fetchingThoughtsSpinner.hide();
                });

           
        }
    }

    function initializeAddThoughtButton(network) {
        /**
         * Stores currently selected thought -- the one which user clicked last time.
         */
        var currentSelectedThought = currentViewedThought;
        $('[data-text="currentViewedThought"]').html(currentViewedThought.name);

        var addChildButton = document.querySelector('[data-action="addChild"');
        console.log('addChildButton: ', addChildButton);
        console.log('adding click listener for addChildButton');
        addChildButton.addEventListener('click', createThought);
    //    network.on('click', networkClickHandler);

        function createThought() {
            console.log('redirecting to create-thought. TargetThought: ', currentSelectedThought);
            router.go('create-thought', {
                parentThought: currentSelectedThought
            });
            return false;
        }
    }



    /**
     * Initializes context menu.
     * Currently not used anymore.
     */
    function initializeContextMenu() {
        console.log('thoughts mind map view: initializing context menu');
        var contextMenu = new ContextMenu({
            container: container,
            network: network,
            nodes: nodes
        });
        contextMenu.init();

    }

});
