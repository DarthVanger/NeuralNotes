define([], function() {

    var BrainVisNetwork = function() {
        console.debug('vis.js: ', vis);
        this.visNetwork;
        this.visEdges;
        this.visNodes;
    }

    BrainVisNetwork.prototype.renderInitialThought = function(thought) {
        console.debug('BrainVisNetwork.renderInitialThought(): ', thought);

        var visNodesArray = [];
        var visEdgesArray = [];

        // draw the passed thought first
        visNodesArray.push({ id: thought.id, label: thought.name });

        // draw a parent thought if it's not the root node.
        if (thought.parent) {
            visNodesArray.push({
                id: thought.parent.id,
                label: thought.parent.name,
                group: 'parent'
            });
            visEdgesArray.push({
                from: thought.parent.id,
                to: thought.id
            });
        }

        // add thought children
        console.debug('BrainVisNetwork: thought.children: ', thought.children);
        _.each(thought.children, function(childThought) {
            //console.log('pushing childThought: ', childThought);
            childThought.parent = thought;
            visNodesArray.push({
                id: childThought.id,
                label: childThought.name,
                group: 'children'
            });
            visEdgesArray.push({
                from: thought.id,
                to: childThought.id
            });
        });

        /**
         * Create vis data set from structure
         * generated from thoughts
         */
        console.debug('visNodesArray: ', visNodesArray);
        console.debug('visEdgesArray: ', visEdgesArray);
        this.visNodes = new vis.DataSet(visNodesArray);

        // create an array with edges
        this.visEdges = new vis.DataSet(visEdgesArray);

        /**
         * Container for the vis network visualization
         */
        this.container = document.getElementById('thoughts-container');
        this.container.innerHTML = '';

        /**
         * Collect options and initialize the vis network
         * visualization (render).
         */
        var options = {
          interaction: {
            //navigationButtons: true,
            keyboard: true
          },
          edges: {
            arrows: {to : true },
            smooth: true
          },
          // set different color for children and parent
          // (not rly needed now when displaying all thoughts on same
          // network).
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

        // provide the data in the vis format
        var data = {
            nodes: this.visNodes,
            edges: this.visEdges
        };

        // initialize your network!
        console.log('initilizing vis network');
        console.log('this.container: ', this.container);
        console.log('data: ', data);
        this.visNetwork = new vis.Network(this.container, data, options);
    };

    BrainVisNetwork.prototype.addChildThoughts = function(options) {
        var self = this;
        console.debug('BrainVisNetwork.addChildThoughts(). Options: ', options);
        _.each(options.children, function(childThought) {
            self.visNodes.add({
                id: childThought.id,
                label: childThought.name,
                group: 'children'
            });
            self.visEdges.add({
                from: options.parentThoughtId,
                to: childThought.id
            });
        });
    };

    return BrainVisNetwork;
});
