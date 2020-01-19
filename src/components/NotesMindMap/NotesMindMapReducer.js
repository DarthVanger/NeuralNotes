import {
  CHANGE_NOTE_TEXT_ACTION,
  CHANGE_SELECTED_NOTE_ACTION,
  SELECTED_NOTE_CHILDREN_FETCHED_ACTION,
  EDIT_NOTE_NAME_ACTION,
  NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION,
  CREATE_NOTE_SUCCESS_ACTION,
  MIND_MAP_CLICKED_ACTION,
  DELETE_NOTE_REQUEST_SUCCESS_ACTION,
  CHANGE_PARENT_BUTTON_CLICKED_ACTION,
  CHANGE_PARENT_REQUEST_SUCCESS_ACTION,
  CHANGE_PARENT_REQUEST_FAIL_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';
import { ROOT_NOTE_FOUND_ACTION } from 'components/App/AppActions.js';
import {
  updateGroupOfOldParent,
  addGroupTagToNote,
  removeNoteFromGraph,
} from '../../helpers/graph';

const defaultState = {
  selectedNote: {},
  showNoteNameEditor: false,
  noteText: '',
  isChangeParentModeActive: false,
  notes: [],
  edges: [],
};

export const notesMindMapReducer = (state = defaultState, { type, data }) => {
  const handleSelectedNoteChildrenFetchedAction = () => {
    let notes = [...state.notes];
    let edges = [...state.edges];

    const childNotes = data;
    if (childNotes.length) {
      childNotes.forEach(child => {
        notes.push({
          id: child.id,
          label: child.name,
          name: child.name,
          isNote: child.isNote,
          group: 'children',
        });
        edges.push({ from: child.parent.id, to: child.id });
      });
      notes = addGroupTagToNote(notes, state.selectedNote.id);
    }
    return { ...state, notes, edges };
  };

  const handleEditNoteNameAction = () => {
    const noteToEdit = data;
    return { ...state, showNoteNameEditor: true, selectedNote: noteToEdit };
  };

  const handleNoteNameUpdateRequestSuccessAction = () => {
    const updatedNote = data;
    let notes = [...state.notes];
    notes = notes.filter(note => note.id !== updatedNote.id);
    notes.push({
      id: updatedNote.id,
      label: updatedNote.name,
      name: updatedNote.name,
      isNote: updatedNote.isNote,
    });
    return { ...state, notes };
  };

  const handleCreateNoteSuccessAction = () => {
    const newNote = data;
    let notes = [...state.notes];
    let edges = [...state.edges];
    notes.push({
      id: newNote.id,
      name: newNote.name,
      label: newNote.name,
      isNote: newNote.isNote,
      group: 'children',
    });
    edges.push({ from: newNote.parent.id, to: newNote.id });
    notes = addGroupTagToNote(notes, state.selectedNote.id);
    return { ...state, notes, edges };
  };

  const handleDeleteNoteRequestSuccessAction = () => {
    const noteToDelete = data;
    let notes = [...state.notes];
    let edges = [...state.edges];
    let graph = removeNoteFromGraph(notes, edges, noteToDelete);
    notes = graph.notes;
    edges = graph.edges;
    return { ...state, notes, edges };
  };

  const handleChangeParentNoteRequestSuccess = () => {
    const noteId = data.noteId;
    const newParentId = data.newParentId;
    let edges = [...state.edges];
    let notes = [...state.notes];
    const oldParent = edges.find(edge => edge.to === noteId);
    edges = edges.filter(edge => edge.to !== noteId);
    edges.push({ from: newParentId, to: noteId });

    notes = updateGroupOfOldParent(notes, edges, newParentId, oldParent.from);
    return {
      ...state,
      isChangeParentModeActive: false,
      showNoteNameEditor: false,
      edges,
      notes,
    };
  };

  const handleChangeSelectedNoteAction = () => {
    const newState = { ...state };
    newState.selectedNote = data.note;
    return { ...state, selectedNote: data.note };
  };

  const addRootToGraph = () => {
    let notes = [...state.notes];
    notes.push({ id: data.id, label: data.name });
    return { ...state, notes };
  };

  switch (type) {
    case ROOT_NOTE_FOUND_ACTION:
      return addRootToGraph();
    case CHANGE_SELECTED_NOTE_ACTION:
      return handleChangeSelectedNoteAction();
    case SELECTED_NOTE_CHILDREN_FETCHED_ACTION:
      return handleSelectedNoteChildrenFetchedAction(data);
    case CHANGE_NOTE_TEXT_ACTION:
      return { ...state, noteText: data };
    case EDIT_NOTE_NAME_ACTION:
      return handleEditNoteNameAction({ state, data });
    case NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION:
      return handleNoteNameUpdateRequestSuccessAction({ state, data });
    case CREATE_NOTE_SUCCESS_ACTION:
      return handleCreateNoteSuccessAction({ state, data });
    case MIND_MAP_CLICKED_ACTION:
      if (state.isChangeParentModeActive) {
        return state;
      } else {
        return { ...state, showNoteNameEditor: false };
      }
    case DELETE_NOTE_REQUEST_SUCCESS_ACTION:
      return handleDeleteNoteRequestSuccessAction({ state, data });
    case CHANGE_PARENT_BUTTON_CLICKED_ACTION:
      return { ...state, isChangeParentModeActive: true };
    case CHANGE_PARENT_REQUEST_SUCCESS_ACTION:
      return handleChangeParentNoteRequestSuccess();
    case CHANGE_PARENT_REQUEST_FAIL_ACTION:
      return { ...state, isChangeParentModeActive: false };
    default:
      return state;
  }
};
