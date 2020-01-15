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
import {
  ROOT_NOTE_FOUND_ACTION,
} from 'components/App/AppActions.js';
import { removeNoteFromGraph } from '../../helpers/graph'

const defaultState = {
  selectedNote: {},
  showNoteNameEditor: false,
  noteText: '',
  isChangeParentModeActive: false,
  rootNote: undefined,
  notes: [],
  edges: []
};

export const notesMindMapReducer = (state = defaultState, { type, data }) => {
  const handleSelectedNoteChildrenFetchedAction = () => {
      const newState = cloneTreeInState();
      const childNotes = data;
      if (childNotes.length) {
        childNotes.forEach(child => {
          newState.notes.push({ id: child.id, name: child.name, label: child.name, isNote: child.isNote });
          newState.edges.push({ from: child.parent.id, to: child.id });
        });
      }
      return newState;
  };

  const handleEditNoteNameAction = () => {
      const noteToEdit = data;
      return { ...state, showNoteNameEditor: true, selectedNote: noteToEdit };
  };

  const handleNoteNameUpdateRequestSuccessAction = () => {
    const updatedNote = data;
    const newState = cloneTreeInState();
    newState.notes = newState.notes.filter(note => note.id !== updatedNote.id)
    newState.notes.push({ id: updatedNote.id, name: updatedNote.name, label: updatedNote.name, isNote: updatedNote.isNote });
    return newState;
  };

  const handleCreateNoteSuccessAction = () => {
    const newNote = data;
    const newState = cloneTreeInState();
    newState.notes.push({ id: newNote.id, name: newNote.name, label: newNote.name, isNote: newNote.isNote });
    newState.edges.push({ from: newNote.parent.id, to: newNote.id });

    return newState;
  };

  const handleDeleteNoteRequestSuccessAction = () => {
    const noteToDelete = data;
    const newState = cloneTreeInState();
    let graph = removeNoteFromGraph(newState.notes, newState.edges, noteToDelete)
    newState.notes = graph.notes
    newState.edges = graph.edges
    return newState;
  };

  const handleChangeParentNoteRequestSuccess = () => {
    const noteId = data.noteId;
    const newParentId = data.newParentId;
    const newState = cloneTreeInState();

    newState.edges = newState.edges.filter(edge => edge.to !== noteId)
    newState.edges.push({ from: newParentId, to: noteId });

    return {
      ...newState,
      isChangeParentModeActive: false,
      showNoteNameEditor: false,
    };
  }

  const handleChangeSelectedNoteAction = () => {
    const newState = cloneTreeInState();
    newState.selectedNote = data;
    return newState;
  }

  const addRootToGraph = () => {
    const newState = { ...state };
    newState.rootNote = data;
    newState.notes.push({ id: data.id, label: data.name });
    return newState;
  }

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
        return { ...state, showNoteNameEditor: false }
      }
    case DELETE_NOTE_REQUEST_SUCCESS_ACTION:
      return handleDeleteNoteRequestSuccessAction({ state, data });
    case CHANGE_PARENT_BUTTON_CLICKED_ACTION:
      return { ...state, isChangeParentModeActive: true }
    case CHANGE_PARENT_REQUEST_SUCCESS_ACTION:
      return handleChangeParentNoteRequestSuccess();
    case CHANGE_PARENT_REQUEST_FAIL_ACTION:
      return { ...state, isChangeParentModeActive: false };
    default:
      return state;
  }

  /**
   * Clone tree in the state by cloning rootNote and selectedNote.
   * If rootNote is not cloned, the mind map won't be re-rendered.
   */
  function cloneTreeInState() {
    const clonedState = { ...state };
    clonedState.rootNote = { ...state.rootNote };
    clonedState.selectedNote = { ...state.selectedNote };
    clonedState.notes = [ ...state.notes ];
    clonedState.edges = [ ...state.edges ];

    return clonedState;
  }
};
