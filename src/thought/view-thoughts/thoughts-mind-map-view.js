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
    var brainVisNetwork;
    var visNetworkHelper;
    var thoughts = [];
    var currentViewedThought;
    var currentViewedThoughtId;
    var initialThought;

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
        console.debug('options.selectedThoughtId: ', options.selectedThoughtId);
        initialThought = options.selectedThought || thoughts.root;
        currentViewedThought = initialThought;
        currentViewedThoughtId = initialThought.id;
        console.debug('currentViewedThoughtId: ', currentViewedThoughtId);
    }
    
    /**
     * Create new vis network for thoughts.
     * (Erases the old one).
     */
    function render() {
        console.debug('redner!');
        console.debug('thoughts: ', thoughts);

        console.debug('thoughts-mind-map-view: initializing brainVisNetwork');
        brainVisNetwork = new BrainVisNetwork();
        console.debug('thoughts-mind-map-view: brainVisNetwork instance: ', brainVisNetwork);
        brainVisNetwork.renderInitialThought(initialThought);
        //var visNetwork = renderVisNetworkForOneThought(currentViewedThought);
        console.debug('brainVisNetwork: ', brainVisNetwork);
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
            console.debug('change thought!');
            console.debug('event: ', event);
            var targetThoughtId = visNetworkHelper.getTargetThoughtId(event);

            // if clicking on the current thought, do nothing.
            if (targetThoughtId === currentViewedThoughtId) {
                return;
            }

            console.debug('brainVisNetwork.visNodes.getIds(): ', brainVisNetwork.visNodes.getIds());

            var currentViewedThoughtId_temp = _.find(brainVisNetwork.visNodes.getIds(),
                function(nodeId) {
                    return nodeId == targetThoughtId;
                }
            );

            console.debug('currentViewedThoughtId from visNodes: ', currentViewedThoughtId_temp);

            var node = brainVisNetwork.visNodes.get(currentViewedThoughtId_temp);
            console.debug('node from visNodes: ', node);

            currentViewedThought = {
                id: node.id,
                name: node.label
            };

            console.debug('currentViewedThought from visNodes: ', currentViewedThought);

            console.debug('targetThoughtId: ', targetThoughtId);
            console.debug('brainVisNetwork.visNodes: ', brainVisNetwork.visNodes);

            console.debug('brainVisNetwork.visNodes: ', brainVisNetwork.visNodes);
            currentViewedThoughtId = targetThoughtId;
            thoughtStorage.logTree();
            var targetThought = thoughtStorage.findThoughtById(targetThoughtId);

            if (!targetThought) {
                throw new Error('changeThought(): couldn\'t find targetThought in thoughtStorage by id: ', targetThoughtId);
            }

            console.debug('thoughts-mind-map-view.changeThought(): targetThought: ', targetThought);
            if (!_.isEmpty(targetThought.children)) {
                renderChildren();
            } else {
                var fetchingThoughtsSpinner = spinner.create('loading child thoughts');
                fetchingThoughtsSpinner.show();
                thoughtStorage.fetchChildThoughts(targetThoughtId)
                    .then(function(children) {
                        targetThought.children = children;
                        console.debug('fetched child thoughts: ', children);
                        renderChildren();
                    })
                    .finally(function() {
                        fetchingThoughtsSpinner.hide();
                    });
            }


           function renderChildren() {
               var children = targetThought.children;
               $('[data-text="currentViewedThought"]').html(currentViewedThought.name);
               console.debug('thoughts-mind-map-view: adding child thoughts to brainVisNetwork');
               brainVisNetwork.addChildThoughts({
                   children: children,
                   parentThoughtId: targetThoughtId
               });
           }
           
        }
    }

    function initializeAddThoughtButton(network) {
        $('[data-text="currentViewedThought"]').html(currentViewedThought.name);

        var addChildButton = document.querySelector('[data-action="addChild"');
        console.debug('addChildButton: ', addChildButton);
        console.debug('adding click listener for addChildButton');
        addChildButton.addEventListener('click', createThought);
    //    network.on('click', networkClickHandler);

        function createThought() {
            console.debug('redirecting to create-thought. Passing thought as parent: ', currentViewedThought);
            router.go('create-thought', {
                parentThought: currentViewedThought
            });
            return false;
        }
    }



    /**
     * Initializes context menu.
     * Currently not used anymore.
     */
    function initializeContextMenu() {
        console.debug('thoughts mind map view: initializing context menu');
        var contextMenu = new ContextMenu({
            container: container,
            network: network,
            nodes: nodes
        });
        contextMenu.init();

    }

});
