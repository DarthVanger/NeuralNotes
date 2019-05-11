import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BrainVisNetwork from 'thought/view-thoughts/brain-vis-network';
import VisNetworkHelper from 'thought/view-thoughts/vis-network-helper';
import thoughtStorage from 'storage/thought-storage';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import _ from 'underscore';
import { ThoughtNameEditor } from 'ui/thought-name-editor';

let brainVisNetwork;
let visNetworkHelper;

let spinner = siteGlobalLoadingBar.create('mind map');

export class ThoughtsMindMapView extends Component {
  state = { selectedNote: null };

  ref = React.createRef();

  render() {
    const { selectedNote } = this.state;

    return (
      <div ref={this.ref} id="thoughts-container">
        {selectedNote && <ThoughtNameEditor
          thought={thoughtStorage.findThoughtById(selectedNote.id)}
          onChange={this.onNoteSelect}
          onDeleteClick={this.onDeleteClick}
          onUploadFileClick={this.onUploadFileClick}
        />}
      </div>
    );
  }

  componentWillMount() {
    this.setOptions();
  }

  componentDidMount() {
    const { initialThought } = this.state;

    brainVisNetwork = new BrainVisNetwork({
      containerDomElement: this.ref.current
    });

    brainVisNetwork.renderInitialThought(initialThought);
    this.changeThought(initialThought);
    visNetworkHelper = new VisNetworkHelper(brainVisNetwork.visNetwork);

    brainVisNetwork.visNetwork.on('click', this.visNetworkClickHandler);
    brainVisNetwork.visNetwork.on('doubleClick', this.visNetworkDoubleClickHandler);
    brainVisNetwork.visNetwork.on('hold', this.visNetworkHoldHandler);
  }

  /**
   * Set thoughts and selectedThought.
   */
  setOptions() {
    const { thoughts, selectedThought } = this.props;
    this.setState({
      thoughts,
      initialThought: selectedThought,
      currentViewedThought: selectedThought,
      currentViewedThoughtId: selectedThought.id,
    });
  }

  /**
   * Load child thoughts for clicked thought,
   * and redraw the network for new thoughts.
   */
  changeThought(targetThought) {
    console.info('[Event] Change thought to ' + targetThought.name);
    console.debug('thoughts-mind-map-view.changeThought()');

    console.debug('thoughts-mind-map-view.changeThought(): targetThought.children: ', targetThought.children);
    if (!_.isEmpty(targetThought.children)) {
      console.debug('thoughts-mind-map-view.changeThought(): targetThought has children in cache, rendering them: ', targetThought.children);
      renderChildren(targetThought.children);
    } else {
      console.info('[Get] child thoughts for "' + targetThought.name + '"...');
      fetchChildThoughts(targetThought)
        .then(renderChildren);
    }

    this.props.changeNote(targetThought);

    if (targetThought.parent) {
      if (!_.isEmpty(targetThought.parent.name)) {
        console.info('thoughts-mind-map-view.changeThought(): thought has a parent in cache, going to render it');
        renderParent();
      } else {
        console.info('[Get] parent for "' + targetThought.name + '"...');
        fetchParentThought(targetThought.id)
          .then(function (thought) {
            targetThought.parent = thought;
            console.info('[Loaded] parent "' + thought.name + '"' + ' for thought "' + targetThought.name + '"');
            renderParent();

          });
      }
    }

    function fetchChildThoughts(thought) {
      var fetchingThoughtsSpinner = spinner.create('loading child thoughts');
      fetchingThoughtsSpinner.show();
      return thoughtStorage.fetchChildThoughts(thought)
        .finally(function () {
          fetchingThoughtsSpinner.hide();
        });
    }

    function fetchParentThought(thoughtId) {
      var fetchingParentThought = spinner.create('loading parent thought');
      return thoughtStorage.fetchParentThought(thoughtId)
        .finally(function () {
          fetchingParentThought.hide();
        });
    }

    function renderChildren(children) {
      console.debug('thoughts-mind-map-view: adding child thoughts to brainVisNetwork');
      brainVisNetwork.addChildThoughts({
        children: children,
        parentThoughtId: targetThought.id
      });
    }

    function renderParent() {
      brainVisNetwork.renderParentThought(targetThought);
    }
  }

  thoughtClickHandler = targetThoughtId => {
    const { currentViewedThoughtId } = this.state;

    // if clicking on the current thought, do nothing.
    if (targetThoughtId === currentViewedThoughtId) {
      console.info('Click was on the selected note, doing nothing')
      return;
    }

    var currentViewedThoughtId_temp = _.find(brainVisNetwork.visNodes.getIds(),
      function (nodeId) {
        return nodeId == targetThoughtId;
      }
    );

    console.debug('currentViewedThoughtId from visNodes: ', currentViewedThoughtId_temp);

    var node = brainVisNetwork.visNodes.get(currentViewedThoughtId_temp);
    console.debug('node from visNodes: ', node);

    this.setState({
      currentViewedThought: {
        id: node.id,
        name: node.label
      }
    });

    console.debug('currentViewedThought from visNodes: ', this.state.currentViewedThought);

    console.debug('targetThoughtId: ', targetThoughtId);
    console.debug('brainVisNetwork.visNodes: ', brainVisNetwork.visNodes);

    console.debug('brainVisNetwork.visNodes: ', brainVisNetwork.visNodes);

    this.setState({ currentViewedThoughtId: targetThoughtId });
    thoughtStorage.logTree();
    var targetThought = thoughtStorage.findThoughtById(targetThoughtId);

    if (!targetThought) {
      throw new Error('changeThought(): couldn\'t find targetThought in thoughtStorage by id: ', targetThoughtId);
    }
    console.debug('thoughts-mind-map-view.thoughtClickHandler(): targetThought: ', targetThought);

    this.changeThought(targetThought);
  };

  visNetworkClickHandler = event => {
    this.closeThoughtNameEditor();
    if (visNetworkHelper.clickedOnThought(event)) {
      console.debug('change thought!');
      console.debug('event: ', event);
      let targetThoughtId = visNetworkHelper.getTargetThoughtId(event);

      this.thoughtClickHandler(targetThoughtId);
    }
  };

  visNetworkDoubleClickHandler = event => {
    if (visNetworkHelper.clickedOnThought(event)) {
      let targetThoughtId = visNetworkHelper.getTargetThoughtId(event);
      console.info('=== Event === Node double click');
      this.createEmptyChild(targetThoughtId);
    }
  };

  visNetworkHoldHandler = event => {
    if (visNetworkHelper.clickedOnThought(event)) {
      let targetThoughtId = visNetworkHelper.getTargetThoughtId(event);
      console.info('=== Event === Node hold');
      this.editThought(targetThoughtId);
    }
  };

  editThought(targetThoughtId) {
    const thought = thoughtStorage.findThoughtById(targetThoughtId);

    if (thought.name === thoughtStorage.APP_FOLDER_NAME) {
      console.info('It is not allowed to edit App root folder name');
      return;
    }

    if (!thought.isNote) {
      console.info('It is not allowed to edit user-uploaded files');
      return;
    }

    this.setState({
      currentViewedThought: thought,
      selectedNote: {
        id: targetThoughtId
      }
    });
    brainVisNetwork.selectNote(targetThoughtId);
  }

  onNoteSelect = name => {
    const { id } = this.state.selectedNote;
    thoughtStorage.updateThoughtName({ id, name })
      .then(() => brainVisNetwork.updateNode({ id, label: name }));
  };

  onDeleteClick = () => {
    let note = this.state.currentViewedThought;
    console.info('Deleting ' + note.name + '...');
    thoughtStorage.remove(note)
      .then(function () {
        console.info('Deleted ' + note.name);
        brainVisNetwork.deleteSelectedNode();
      });
  };

  onUploadFileClick = () => {
    console.info('[Event] Upload file click');
    window.open(thoughtStorage.getLinkToThought(this.state.currentViewedThought));
  };

  closeThoughtNameEditor() {
    this.setState({ selectedNote: null });
  }

  createEmptyChild(parentId) {
    var thought = {
      name: 'new',
      content: '',
      isNote: true
    };

    var parent = thoughtStorage.findThoughtById(parentId);

    return thoughtStorage.create(thought, parent)
      .then(newThought => {
        thought.id = newThought.id;

        var children = [thought];

        thoughtStorage.addChildrenToTree({
          parentId: parentId,
          children: children
        });

        brainVisNetwork.addChildThoughts({
          children: children,
          parentThoughtId: parentId
        });

        this.editThought(thought.id);

        return thought;
      });
  }
}

ThoughtsMindMapView.propTypes = {
  thoughts: PropTypes.object.isRequired,
  selectedThought: PropTypes.object.isRequired,
  changeNote: PropTypes.func.isRequired
};
