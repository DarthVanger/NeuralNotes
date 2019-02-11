import _ from 'underscore';
import vis from 'vis/dist/vis.js';
import './view-thoughts.css';

let BrainVisNetwork = function (options) {
  console.debug('vis.js: ', vis);
  this.containerDomElement = options.containerDomElement;
  this.visNetwork = null;
  this.visEdges = null;
  this.visNodes = null;
};

BrainVisNetwork.prototype.renderParentThought = function (thought) {
  console.debug('BrainVisNetwork.renderParentThought(): thought: ', thought);
  if (!thought.parent) {
    // don't render parent for root thought
    // TODO: refactor to use function to check for root thought
    return;
  }

  if (this.visNodes.get(thought.parent.id)) {
    // don't try to add existing nodes, because vis DataSet will throw an error
    return;
  }

  this.visNodes.add({
    id: thought.parent.id,
    label: thought.parent.name,
    group: 'parent'
  });
  this.visEdges.add({
    from: thought.parent.id,
    to: thought.id
  });
};

BrainVisNetwork.prototype.renderInitialThought = function (thought) {
  console.debug('BrainVisNetwork.renderInitialThought(): ', thought);

  let visNodesArray = [];
  let visEdgesArray = [];

  // draw the passed thought first
  visNodesArray.push({id: thought.id, label: thought.name});

  // add thought children
  console.debug('BrainVisNetwork: thought.children: ', thought.children);
  _.each(thought.children, function (childThought) {
    //childThought.parent = thought;
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
  this.container = this.containerDomElement;
  this.container.innerHTML = '';

  /**
   * Collect options and initialize the vis network
   * visualization (render).
   */
  let options = {
    interaction: {
      keyboard: false
    },
    edges: {
      arrows: {to: true},
      smooth: true
    },
    // set different color for children and parent
    // (not rly needed now when displaying all thoughts on same
    // network).
    groups: {
      children: {
        color: {
          background: '#eef',
          borderWidth: 3
        }
      },
      parent: {
        color: {
          background: '#faa'
        }
      }
    }

  };

  // provide the data in the vis format
  let data = {
    nodes: this.visNodes,
    edges: this.visEdges
  };

  // initialize your network!
  console.debug('initilizing vis network');
  console.debug('this.container: ', this.container);
  console.debug('data: ', data);
  this.visNetwork = new vis.Network(this.container, data, options);
  console.info('Visual Network initialized');
};

BrainVisNetwork.prototype.addChildThoughts = function (options) {
  let self = this;
  console.debug('BrainVisNetwork.addChildThoughts(). Options: ', options);
  _.each(options.children, function (childThought) {
    if (self.visNodes.get(childThought.id)) {
      // don't try to add existing nodes, because vis DataSet will throw an error
      return;
    }

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

BrainVisNetwork.prototype.updateNode = function (options) {
  this.visNodes.update({
    id: options.id,
    label: options.label
  });
};

BrainVisNetwork.prototype.deleteSelectedNode = function () {
  this.visNetwork.deleteSelected();
};

BrainVisNetwork.prototype.selectNote = function (noteId) {
  this.visNetwork.selectNodes([noteId]);
};

export default BrainVisNetwork;