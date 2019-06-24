import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import BrainVisNetwork from 'note/view-notes/brain-vis-network';
import VisNetworkHelper from 'note/view-notes/vis-network-helper';
import noteStorage from 'storage/note-storage';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import { NoteNameEditor } from 'ui/note-name-editor';
import { StyledNotesMindMap } from 'components/NotesMindMapView/NotesMindMapViewStyles';

let brainVisNetwork;
let visNetworkHelper;
let spinner = siteGlobalLoadingBar.create('mind map');

export class NotesMindMapViewComponent extends Component {
  state = { selectedNote: null };

  ref = React.createRef();

  render() {
    const { selectedNote } = this.state;

    return (
      <StyledNotesMindMap ref={this.ref}>
        {selectedNote && <NoteNameEditor
          note={noteStorage.findNoteById(selectedNote.id)}
          onChange={this.onNoteSelect}
          onDeleteClick={this.onDeleteClick}
          onUploadFileClick={this.onUploadFileClick}
        />}
      </StyledNotesMindMap>
    );
  }

  componentWillMount() {
    this.setOptions();
  }

  componentDidMount() {
    const { initialNote } = this.state;

    brainVisNetwork = new BrainVisNetwork({
      containerDomElement: this.ref.current
    });

    brainVisNetwork.renderInitialNote(initialNote);

    this.changeNote(initialNote);
    visNetworkHelper = new VisNetworkHelper(brainVisNetwork.visNetwork);

    brainVisNetwork.visNetwork.on('click', this.visNetworkClickHandler);
    brainVisNetwork.visNetwork.on('doubleClick', this.visNetworkDoubleClickHandler);
    brainVisNetwork.visNetwork.on('hold', this.visNetworkHoldHandler);
  }

  /**
   * Set notes and selectedNote.
   */
  setOptions() {
    const { selectedNote } = this.props;
    this.setState({
      initialNote: selectedNote,
      currentViewedNote: selectedNote,
      currentViewedNoteId: selectedNote.id,
    });
  }

  /**
   * Load child notes for clicked note,
   * and redraw the network for new notes.
   */
  changeNote(targetNote) {
    console.info('[Event] Change note to ' + targetNote.name);
    console.debug('notes-mind-map-view.changeNote()');

    console.debug('notes-mind-map-view.changeNote(): targetNote.children: ', targetNote.children);
    if (!_.isEmpty(targetNote.children)) {
      console.debug('notes-mind-map-view.changeNote(): targetNote has children in cache, rendering them: ', targetNote.children);
      renderChildren(targetNote.children);
    } else {
      console.info('[Get] child notes for "' + targetNote.name + '"...');
      fetchChildNotes(targetNote)
        .then(renderChildren);
    }

    this.saveNote(targetNote);

    if (targetNote.parent) {
      if (!_.isEmpty(targetNote.parent.name)) {
        console.info('notes-mind-map-view.changeNote(): note has a parent in cache, going to render it');
        renderParent();
      } else {
        console.info('[Get] parent for "' + targetNote.name + '"...');
        fetchParentNote(targetNote.id)
          .then(function (note) {
            targetNote.parent = note;
            console.info('[Loaded] parent "' + note.name + '"' + ' for note "' + targetNote.name + '"');
            renderParent();

          });
      }
    }

    function fetchChildNotes(note) {
      var fetchingNotesSpinner = spinner.create('loading child notes');
      fetchingNotesSpinner.show();
      return noteStorage.fetchChildNotes(note)
        .finally(function () {
          fetchingNotesSpinner.hide();
        });
    }

    function fetchParentNote(noteId) {
      var fetchingParentNote = spinner.create('loading parent note');
      return noteStorage.fetchParentNote(noteId)
        .finally(function () {
          fetchingParentNote.hide();
        });
    }

    function renderChildren(children) {
      console.debug('notes-mind-map-view: adding child notes to brainVisNetwork');
      brainVisNetwork.addChildNotes({
        children: children,
        parentNoteId: targetNote.id
      });
    }

    function renderParent() {
      brainVisNetwork.renderParentNote(targetNote);
    }
  }

  noteClickHandler = targetNoteId => {
    const { currentViewedNoteId } = this.state;

    // if clicking on the current note, do nothing.
    if (targetNoteId === currentViewedNoteId) {
      console.info('Click was on the selected note, doing nothing')
      return;
    }

    var currentViewedNoteId_temp = _.find(brainVisNetwork.visNodes.getIds(),
      function (nodeId) {
        return nodeId == targetNoteId;
      }
    );

    console.debug('currentViewedNoteId from visNodes: ', currentViewedNoteId_temp);

    var node = brainVisNetwork.visNodes.get(currentViewedNoteId_temp);
    console.debug('node from visNodes: ', node);

    this.setState({
      currentViewedNote: {
        id: node.id,
        name: node.label
      }
    });

    console.debug('currentViewedNote from visNodes: ', this.state.currentViewedNote);

    console.debug('targetNoteId: ', targetNoteId);
    console.debug('brainVisNetwork.visNodes: ', brainVisNetwork.visNodes);

    console.debug('brainVisNetwork.visNodes: ', brainVisNetwork.visNodes);

    this.setState({ currentViewedNoteId: targetNoteId });
    noteStorage.logTree();
    var targetNote = noteStorage.findNoteById(targetNoteId);

    if (!targetNote) {
      throw new Error('changeNote(): couldn\'t find targetNote in noteStorage by id: ', targetNoteId);
    }
    console.debug('notes-mind-map-view.noteClickHandler(): targetNote: ', targetNote);

    this.changeNote(targetNote);
  };

  visNetworkClickHandler = event => {
    this.closeNoteNameEditor();
    if (visNetworkHelper.clickedOnNote(event)) {
      console.debug('change note!');
      console.debug('event: ', event);
      let targetNoteId = visNetworkHelper.getTargetNoteId(event);

      this.noteClickHandler(targetNoteId);
    }
  };

  visNetworkDoubleClickHandler = event => {
    if (visNetworkHelper.clickedOnNote(event)) {
      let targetNoteId = visNetworkHelper.getTargetNoteId(event);
      console.info('=== Event === Node double click');
      this.createEmptyChild(targetNoteId);
    }
  };

  visNetworkHoldHandler = event => {
    if (visNetworkHelper.clickedOnNote(event)) {
      let targetNoteId = visNetworkHelper.getTargetNoteId(event);
      console.info('=== Event === Node hold');
      this.editNote(targetNoteId);
    }
  };

  editNote(targetNoteId) {
    const note = noteStorage.findNoteById(targetNoteId);

    if (note.name === noteStorage.APP_FOLDER_NAME) {
      console.info('It is not allowed to edit App root folder name');
      return;
    }

    if (!note.isNote) {
      console.info('It is not allowed to edit user-uploaded files');
      return;
    }

    this.setState({
      currentViewedNote: note,
      selectedNote: {
        id: targetNoteId
      }
    });
    brainVisNetwork.selectNote(targetNoteId);
  }

  onNoteSelect = name => {
    const { id } = this.state.selectedNote;
    noteStorage.updateNoteName({ id, name })
      .then(() => brainVisNetwork.updateNode({ id, label: name }));
  };

  onDeleteClick = () => {
    let note = this.state.currentViewedNote;
    console.info('Deleting ' + note.name + '...');
    noteStorage.remove(note)
      .then(function () {
        console.info('Deleted ' + note.name);
        brainVisNetwork.deleteSelectedNode();
      });
  };

  onUploadFileClick = () => {
    console.info('[Event] Upload file click');
    window.open(noteStorage.getLinkToNote(this.state.currentViewedNote));
  };

  closeNoteNameEditor() {
    this.setState({ selectedNote: null });
  }

  createEmptyChild(parentId) {
    var note = {
      name: 'new',
      content: '',
      isNote: true
    };

    var parent = noteStorage.findNoteById(parentId);

    return noteStorage.create(note, parent)
      .then(newNote => {
        note.id = newNote.id;

        var children = [note];

        noteStorage.addChildrenToTree({
          parentId: parentId,
          children: children
        });

        brainVisNetwork.addChildNotes({
          children: children,
          parentNoteId: parentId
        });

        this.editNote(note.id);

        return note;
      });
  }

  saveNote = note => {
    const { requestNoteText, changeSelectedNote } = this.props;
    changeSelectedNote(note);
    if (note.isNote) {
      requestNoteText(note);
    }
  };
}

NotesMindMapViewComponent.propTypes = {
  selectedNote: PropTypes.object.isRequired,
  requestNoteText: PropTypes.func.isRequired,
  changeSelectedNote: PropTypes.func.isRequired,
};
