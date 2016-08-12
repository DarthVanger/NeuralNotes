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
            return { id: index, label: thought.name };
        });
        console.debug('visDataSet: ', visDataSet);
        var nodes = new vis.DataSet(visDataSet);

        // create an array with edges
        var edges = new vis.DataSet([
            {from: 0, to: 1},
            //{from: 1, to: 2},
            //{from: 2, to: 4},
            //{from: 2, to: 5}
        ]);

        // create a network
        var container = document.getElementById('output');

        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {};

        // initialize your network!
        var network = new vis.Network(container, data, options);

    }

});
