console.debug('thoughts-mind-map-view.js');
define([
    'router',
    'thought/view-thoughts/context-menu',
    'thought/view-thoughts/vis-network-helper',
    'thought/thought-storage'
], function(
    router,
    ContextMenu,
    VisNetworkHelper,
    thoughtStorage
) {
    console.debug('vis.js: ', vis);

    var visNetworkHelper;
    var thoughts = [];
    var currentViewedThought;

    return {
        set: set,
        render: render
    };

    function set(p_thoughts) {
        thoughts = p_thoughts;
        currentViewedThought = thoughts[0];
    }
    
    function render() {
        console.debug('redner!');
        console.debug('thoughts: ', thoughts);

        var visNetwork = renderVisNetworkForOneThought(currentViewedThought);
        console.log('visNetwork: ', visNetwork);
        visNetworkHelper = new VisNetworkHelper(visNetwork);
        visNetwork.on('click', changeThought);
    }

    function changeThought(event) {
        if (visNetworkHelper.clickedOnThought(event)) {
            console.log('change thought!');
            var targetThoughtId = visNetworkHelper.getTargetThoughtId(event);
            var visibleThoughts = currentViewedThought.children.concat([currentViewedThought.parent]);
            var targetThought = _.findWhere(visibleThoughts, { id: targetThoughtId });
            console.log('targetThoughtId: ', targetThoughtId);
            console.log('targetThought: ', targetThought);

            if (!targetThought) throw new Error('Target thought not found');

            thoughtStorage.fetchChildThoughts(targetThoughtId)
                .then(function(children) {
                    console.log('fetched child thoughts: ', children);
                    targetThought.children = children;
                    currentViewedThought = targetThought;
                    render();
                    //renderVisNetworkForOneThought(targetThought);
                });
        }
    }

    function renderVisNetworkForOneThought(thought) {
        console.log('renderVisNetworkForOneThought(): ', thought);
        /**
         * Initialize vis data set
         **/
        var visEdges = [];

        // TODO: call function only ones.
        // Now it creates two pairs of edges for every node xD.
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

        var contextMenu = new ContextMenu({
            container: container,
            network: network,
            nodes: nodes
        });
        contextMenu.init();

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
                    console.log('pushing childThought: ', childThought);
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
