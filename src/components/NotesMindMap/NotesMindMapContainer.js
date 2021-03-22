import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { action } from 'sagas';
import { UploadsSelectors } from 'selectors';

import {
  CHANGE_SELECTED_NOTE_ACTION,
  NOTE_CHANGE_PARENT_ACTION,
  CREATE_EMPTY_CHILD_ACTION,
  UPDATE_NOTE_NAME_ACTION,
  MIND_MAP_CLICKED_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';
import { NotesMindMapComponent } from 'components/NotesMindMap/NotesMindMapComponent';

const getNotesMindMapState = state => state.notesMindMap;

const createNotesMindMapPropertySelector = property =>
  createSelector(
    getNotesMindMapState,
    notesMindMapState => notesMindMapState[property],
  );

const getRealNotes = createNotesMindMapPropertySelector('nodes');
const getRealEdges = createNotesMindMapPropertySelector('edges');

const getUploadItems = createSelector(
  UploadsSelectors.getUploadsList,
  getRealNotes,
  (uploads, notes) =>
    uploads
      .map(item => ({
        realId: item.result ? item.result.id : null,
        name: item.file.name,
        folderId: item.file.uploadFolderId,
      }))
      .filter(item => {
        return !notes.find(note => note.id === item.realId);
      }),
);

const getPseudoNoteId = item => `pseudo-note-${item.name}`;
const getPseudoEdgeId = item => `pseudo-edge-${item.name}`;

const getPseudoNotes = createSelector(getUploadItems, items =>
  items.map(item => ({
    id: getPseudoNoteId(item),
    label: item.name,
  })),
);

const getPseudoEdges = createSelector(getUploadItems, items =>
  items.map(item => ({
    id: getPseudoEdgeId(item),
    from: item.folderId,
    to: getPseudoNoteId(item),
  })),
);

const getComputedNotes = createSelector(
  getRealNotes,
  getPseudoNotes,
  (realNotes, pseudoNotes) => [...realNotes, ...pseudoNotes],
);

const getComputedEdges = createSelector(
  getRealEdges,
  getPseudoEdges,
  (realEdges, pseudoEdges) => [...realEdges, ...pseudoEdges],
);

const mapStateToProps = createStructuredSelector({
  selectedNote: createNotesMindMapPropertySelector('selectedNote'),
  isChangeParentModeActive: createNotesMindMapPropertySelector(
    'isChangeParentModeActive',
  ),
  nodes: getComputedNotes,
  edges: getComputedEdges,
});

const mapDispatchToProps = () => ({
  changeSelectedNote: data => action(CHANGE_SELECTED_NOTE_ACTION, data),
  changeParentNote: data => action(NOTE_CHANGE_PARENT_ACTION, data),
  createEmptyChild: data => action(CREATE_EMPTY_CHILD_ACTION, data),
  updateNoteName: data => action(UPDATE_NOTE_NAME_ACTION, data),
  onMindMapClick: data => action(MIND_MAP_CLICKED_ACTION, data),
});

export const NotesMindMapContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotesMindMapComponent);
