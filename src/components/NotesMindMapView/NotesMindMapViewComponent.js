import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import { VisNetwork } from 'helpers/visNetwork';
import { VisNetworkHelper } from 'helpers/visNetworkHelper';
import noteStorage from 'storage/noteStorage';
import { NoteNameEditorComponent } from 'components/NoteNameEditor/NoteNameEditorComponent';
import { StyledNotesMindMap } from 'components/NotesMindMapView/NotesMindMapViewStyles';

let visNetwork;

// TODO: continue move to sagas
export class NotesMindMapViewComponent extends Component {
  state = { selectedNote: null };

  ref = React.createRef();

  render() {
    const { selectedNote } = this.state;

    return (
      <StyledNotesMindMap ref={this.ref}>
        {selectedNote && <NoteNameEditorComponent
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

    visNetwork = new VisNetwork({
      containerDomElement: this.ref.current
    });

    visNetwork.renderInitialNote(initialNote);

    this.props.changeVisNetworkNote({ targetNote: initialNote, visNetwork });

    visNetwork.visNetwork.on('click', this.visNetworkClickHandler);
    visNetwork.visNetwork.on('doubleClick', this.visNetworkDoubleClickHandler);
    visNetwork.visNetwork.on('hold', this.visNetworkHoldHandler);
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

  noteClickHandler = targetNoteId => {
    const { currentViewedNoteId } = this.state;

    // if clicking on the current note, do nothing.
    if (targetNoteId === currentViewedNoteId) return;

    const currentViewedNoteId_temp = _.find(visNetwork.visNodes.getIds(),
      function (nodeId) {
        return nodeId === targetNoteId;
      }
    );

    const node = visNetwork.visNodes.get(currentViewedNoteId_temp);
    this.setState({
      currentViewedNote: {
        id: node.id,
        name: node.label
      }
    });

    this.setState({ currentViewedNoteId: targetNoteId });
    noteStorage.logTree();
    let targetNote = noteStorage.findNoteById(targetNoteId);

    if (!targetNote) {
      throw new Error('changeVisNetworkNote(): couldn\'t find targetNote in noteStorage by id: ', targetNoteId);
    }

    this.props.changeVisNetworkNote({ targetNote, visNetwork });
  };

  visNetworkClickHandler = event => {
    this.closeNoteNameEditor();
    if (VisNetworkHelper.clickedOnNote(event)) {
      let targetNoteId = VisNetworkHelper.getTargetNoteId(event);
      this.noteClickHandler(targetNoteId);
    }
  };

  visNetworkDoubleClickHandler = event => {
    if (VisNetworkHelper.clickedOnNote(event)) {
      let targetNoteId = VisNetworkHelper.getTargetNoteId(event);
      console.info('=== Event === Node double click');
      this.createEmptyChild(targetNoteId);
    }
  };

  visNetworkHoldHandler = event => {
    if (VisNetworkHelper.clickedOnNote(event)) {
      let targetNoteId = VisNetworkHelper.getTargetNoteId(event);
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
    visNetwork.selectNote(targetNoteId);
  }

  onNoteSelect = name => {
    const { id } = this.state.selectedNote;
    noteStorage.updateNoteName({ id, name })
      .then(() => visNetwork.updateNode({ id, label: name }));
  };

  onDeleteClick = () => {
    let note = this.state.currentViewedNote;
    console.info('Deleting ' + note.name + '...');
    noteStorage.remove(note)
      .then(function () {
        console.info('Deleted ' + note.name);
        visNetwork.deleteSelectedNode();
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

        visNetwork.addChildNotes({
          children: children,
          parentNoteId: parentId
        });

        this.editNote(note.id);

        return note;
      });
  }
}

NotesMindMapViewComponent.propTypes = {
  selectedNote: PropTypes.object.isRequired,
  requestNoteText: PropTypes.func.isRequired,
  changeSelectedNote: PropTypes.func.isRequired,
  changeVisNetworkNote: PropTypes.func.isRequired,
};
