console.debug('thoughts-mind-map-view.js');
define([
], function(
) {
    console.debug('vis.js: ', vis);

    var thoughts = [];

    return {
        set: set,
        render: render
    };

    function set(p_thoughts) {
        thoughts = p_thoughts;
    }
    
    function render() {
        console.debug('redner!');
     // create an array with nodes
        //var nodes = new vis.DataSet([
        //    {id: 1, label: 'Node 1'},
        //    {id: 2, label: 'Node 2'},
        //    {id: 3, label: 'Node 3'},
        //    {id: 4, label: 'Node 4'},
        //    {id: 5, label: 'Node 5'}
        //]);

        console.debug('thoughts: ', thoughts);

        var visDataSet = thoughts.map(function(thought, index) {
            return { id: thought.id, label: thought.name };
        });
        var visEdges = [];
        _.each(thoughts, function(thought) {
            console.log('thought.children: ', thought.children);
            _.each(thought.children, function(childThought) {
                console.log('pushing children');
                visDataSet.push({ id: childThought.id, label: childThought.name });
                visEdges.push({
                    from: thought.id,
                    to: childThought.id
                });
            });
        });

        console.debug('visDataSet: ', visDataSet);
        console.debug('visEdges: ', visEdges);
        var nodes = new vis.DataSet(visDataSet);

        // create an array with edges
        var edges = new vis.DataSet(visEdges);

        // create a network
        var container = document.getElementById('thoughts-container');

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
        var network = new vis.Network(container, data, options);

        container.addEventListener('click', showContextMenu);

        function showContextMenu(event) {
            var x = event.clientX;
            var y = event.clientY;
            console.log('x: ', x, 'y: ', y);
            var menu = document.createElement('div');
            menu.innerHTML = '<div>asdfasdf<br /> asdfasdfa</div>';
            menu.style.position = 'absolute';
            menu.style.backgroundColor = 'red';
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';

            container.appendChild(menu);
        }

        network.on('click', function(event) {
            var targetThought = getTargetThought(event);
        });

        function getTargetThought(networkEvent) {
            console.log('network click event: ', networkEvent);
            var targetNodeId = networkEvent.nodes[0];
            console.log('targetNodeId: ', targetNodeId);
            var targetNode = nodes.get(targetNodeId);
            console.log('targetNode: ', targetNode);
            var targetThoughtName = targetNode.label;
            console.log('targetThoughtName: ', targetThoughtName);
            var targetThought = _.findWhere(thoughts, { name: targetThoughtName });
            console.log('targetThought: ', targetThought);
        }

    }

});
