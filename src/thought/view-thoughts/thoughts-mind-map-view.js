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
        console.log('options.selectedThoughtId: ', options.selectedThoughtId);
        initialThought = options.selectedThought || thoughts[0];
        currentViewedThought = initialThought;
        currentViewedThoughtId = initialThought.id;
        console.log('currentViewedThoughtId: ', currentViewedThoughtId);
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
            console.log('event: ', event);
            var targetThoughtId = visNetworkHelper.getTargetThoughtId(event);

            // if clicking on the current thought, do nothing.
            if (targetThoughtId === currentViewedThoughtId) {
                return;
            }

            console.log('brainVisNetwork.visNodes.getIds(): ', brainVisNetwork.visNodes.getIds());

            var currentViewedThoughtId_temp = _.find(brainVisNetwork.visNodes.getIds(),
                function(nodeId) {
                    return nodeId == targetThoughtId;
                }
            );

            console.log('currentViewedThoughtId from visNodes: ', currentViewedThoughtId_temp);

            var node = brainVisNetwork.visNodes.get(currentViewedThoughtId_temp);
            console.log('node from visNodes: ', node);

            currentViewedThought = {
                id: node.id,
                name: node.label
            };

            console.log('currentViewedThought from visNodes: ', currentViewedThought);

   //         var visibleThoughts = currentViewedThought.children.concat([currentViewedThought.parent]);
  //          var targetThought = _.findWhere(visibleThoughts, { id: targetThoughtId });
            console.log('targetThoughtId: ', targetThoughtId);
 //           console.log('targetThought: ', targetThought);
            console.log('brainVisNetwork.visNodes: ', brainVisNetwork.visNodes);

//            if (!targetThought) throw new Error('Target thought not found');
            var fetchingThoughtsSpinner = spinner.create('loading child thoughts');
            console.log('brainVisNetwork.visNodes: ', brainVisNetwork.visNodes);
            fetchingThoughtsSpinner.show();
            currentViewedThoughtId = targetThoughtId;
            thoughtStorage.fetchChildThoughts(targetThoughtId)
                .then(function(children) {
                    console.log('fetched child thoughts: ', children);
                    $('[data-text="currentViewedThought"]').html(currentViewedThought.name);
                    console.debug('thoughts-mind-map-view: adding child thoughts to brainVisNetwork');
                    brainVisNetwork.addChildThoughts({
                        children: children,
                        parentThoughtId: targetThoughtId
                    });
                    //render();
                    //renderVisNetworkForOneThought(targetThought);
                })
                .finally(function() {
                    fetchingThoughtsSpinner.hide();
                });

           
        }
    }

    function initializeAddThoughtButton(network) {
        $('[data-text="currentViewedThought"]').html(currentViewedThought.name);

        var addChildButton = document.querySelector('[data-action="addChild"');
        console.log('addChildButton: ', addChildButton);
        console.log('adding click listener for addChildButton');
        addChildButton.addEventListener('click', createThought);
    //    network.on('click', networkClickHandler);

        function createThought() {
            console.log('redirecting to create-thought. Passing thought as parent: ', currentViewedThought);
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
        console.log('thoughts mind map view: initializing context menu');
        var contextMenu = new ContextMenu({
            container: container,
            network: network,
            nodes: nodes
        });
        contextMenu.init();

    }

});
