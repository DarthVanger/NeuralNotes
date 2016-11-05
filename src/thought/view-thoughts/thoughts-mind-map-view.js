console.debug('thoughts-mind-map-view.js');
define([
    'router',
    'thought/view-thoughts/context-menu',
    'thought/view-thoughts/vis-network-helper'
], function(
    router,
    ContextMenu,
    VisNetworkHelper
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
            var targetThought = _.findWhere(currentViewedThought.children, { id: targetThoughtId });
            console.log('targetThoughtId: ', targetThoughtId);
            console.log('targetThought: ', targetThought);
        }
    }

    function renderVisNetworkForOneThought(thought) {
        /**
         * Initialize vis data set
         **/
        var visEdges = [];

        // TODO: call function only ones.
        // Now it creates two pairs of edges for every node xD.
        visDataSet = mapThoughtsToVisNetwork(thought).visDataSet;
        visEdges = mapThoughtsToVisNetwork(thought).visEdges;

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
            //var visDataSet = thoughts.map(function(thought, index) {
            //    return { id: thought.id, label: thought.name };
            //});
                console.log('thought.children: ', thought.children);
                _.each(thought.children, function(childThought) {
                    console.log('pushing childThought: ', childThought);
                    visDataSet.push({ id: childThought.id, label: childThought.name });
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
