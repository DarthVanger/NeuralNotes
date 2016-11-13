console.debug('thoughts-mind-map-view.js');
define([
    'router',
    'thought/view-thoughts/context-menu',
    'thought/view-thoughts/vis-network-helper',
    'thought/thought-storage',
    'spinner/site-global-loading-bar'
], function(
    router,
    ContextMenu,
    VisNetworkHelper,
    thoughtStorage,
    siteGlobalLoadingBar
) {
    console.debug('vis.js: ', vis);

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

        var visNetwork = renderVisNetworkForOneThought(currentViewedThought);
        console.log('visNetwork: ', visNetwork);
        visNetworkHelper = new VisNetworkHelper(visNetwork);
        visNetwork.on('click', changeThought);

        initializeAddThoughtButton(visNetwork);
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

    function renderVisNetworkForOneThought(thought) {
        console.log('renderVisNetworkForOneThought(): ', thought);
        /**
         * Initialize vis data set
         **/
        var visEdges = [];

        visDataSet = mapThoughtsToVisNetwork(thought).visDataSet;
        visEdges = mapThoughtsToVisNetwork(thought).visEdges;

        // make edges be arrows.
        _.each(visEdges, function(visEdge) {
            visEdge.arrows = {
                to: true
            };
        });

        /**
         * Create vis data set from structure
         * generated from thoughts
         */
        console.debug('visDataSet: ', visDataSet);
        console.debug('visEdges: ', visEdges);
        var nodes = new vis.DataSet(visDataSet);

        // create an array with edges
        var edges = new vis.DataSet(visEdges);

        /**
         * Container for the vis network visualization
         */
        var container = document.getElementById('thoughts-container');
        container.innerHTML = '';

        /**
         * Collect options and initialize the vis network
         * visualization (render).
         */

        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges
        };

        var options = {
          interaction: {
            navigationButtons: true,
            keyboard: true
          },
          groups: {
             children: {
                 color: {
                     background:'#eef',
                     borderWidth:3
                 }
             },
             parent: {
                 color: {
                     background:'#faa'
                 }
             }
          }

        };

        // initialize your network!
        console.log('initilizing vis network');
        console.log('container: ', container);
        console.log('data: ', data);
        var network = new vis.Network(container, data, options);

        return network;

        /**
         * Map thought and its children into a vis data set structure
         */
        function mapThoughtsToVisNetwork(thought) {
            var visDataSet = [];
            var visEdges = [];

            visDataSet.push({ id: thought.id, label: thought.name });

            // draw a parent thought if it's not the root node.
            if (thought.parent) {
                visDataSet.push({
                    id: thought.parent.id,
                    label: thought.parent.name,
                    group: 'parent'
                });
                visEdges.push({
                    from: thought.parent.id,
                    to: thought.id
                });
            }

            //var visDataSet = thoughts.map(function(thought, index) {
            //    return { id: thought.id, label: thought.name };
            //});
                console.log('thought.children: ', thought.children);
                _.each(thought.children, function(childThought) {
                    //console.log('pushing childThought: ', childThought);
                    childThought.parent = thought;
                    visDataSet.push({
                        id: childThought.id,
                        label: childThought.name,
                        group: 'children'
                    });
                    visEdges.push({
                        from: thought.id,
                        to: childThought.id
                    });
                });
            //});

            return {
                visDataSet: visDataSet,
                visEdges: visEdges
            };
        }
    }




});
