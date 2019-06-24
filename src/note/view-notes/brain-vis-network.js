import _ from 'underscore';
import vis from 'vis/dist/vis.js';

let BrainVisNetwork = function (options) {
  console.debug('vis.js: ', vis);
  this.containerDomElement = options.containerDomElement;
  this.visNetwork = null;
  this.visEdges = null;
  this.visNodes = null;
};

BrainVisNetwork.prototype.renderParentNote = function (note) {
  console.debug('BrainVisNetwork.renderParentNote(): note: ', note);
  if (!note.parent) {
    // don't render parent for root note
    // TODO: refactor to use function to check for root note
    return;
  }

  if (this.visNodes.get(note.parent.id)) {
    // don't try to add existing nodes, because vis DataSet will throw an error
    return;
  }

  this.visNodes.add({
    id: note.parent.id,
    label: note.parent.name,
    group: 'parent'
  });
  this.visEdges.add({
    from: note.parent.id,
    to: note.id
  });
};

BrainVisNetwork.prototype.renderInitialNote = function (note) {
  console.debug('BrainVisNetwork.renderInitialNote(): ', note);

  let visNodesArray = [];
  let visEdgesArray = [];

  // draw the passed note first
  visNodesArray.push({ id: note.id, label: note.name });

  // add note children
  console.debug('BrainVisNetwork: note.children: ', note.children);
  _.each(note.children, function (childNote) {
    //childNote.parent = note;
    visNodesArray.push({
      id: childNote.id,
      label: childNote.name,
      group: 'children'
    });
    visEdgesArray.push({
      from: note.id,
      to: childNote.id
    });
  });

  /**
   * Create vis data set from structure
   * generated from notes
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

  /**
   * Collect options and initialize the vis network
   * visualization (render).
   */
  let options = {
    interaction: {
      keyboard: false
    },
    edges: {
      arrows: { to: true },
      smooth: true
    },
    // set different color for children and parent
    // (not rly needed now when displaying all notes on same
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

BrainVisNetwork.prototype.addChildNotes = function (options) {
  let self = this;
  console.debug('BrainVisNetwork.addChildNotes(). Options: ', options);
  _.each(options.children, function (childNote) {
    if (self.visNodes.get(childNote.id)) {
      // don't try to add existing nodes, because vis DataSet will throw an error
      return;
    }

    self.visNodes.add({
      id: childNote.id,
      label: childNote.name,
      group: 'children'
    });
    self.visEdges.add({
      from: options.parentNoteId,
      to: childNote.id
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
