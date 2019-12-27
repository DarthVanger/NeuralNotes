import tree from 'helpers/tree';
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
} from 'components/NotesMindMapView/NotesMindMapViewActions';
import {
  ROOT_NOTE_FOUND_ACTION,
} from 'components/App/AppActions.js';

const defaultState = {
  selectedNote: {},
  showNoteNameEditor: false,
  noteText: '',
  isChangeParentModeActive: false,
  rootNote: undefined,
};

export const notesMindMapReducer = (state = defaultState, { type, data }) => {
  const handleSelectedNoteChildrenFetchedAction = () => {
      const newState = cloneTreeInState();
      const childNotes = data;
      if (childNotes.length) {
        newState.selectedNote.children = childNotes;
      } else {
        newState.selectedNote.hasNoChildren = true;
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
    const noteToUpdate = tree(newState.rootNote).find(note => note.id === updatedNote.id);
    noteToUpdate.name = updatedNote.name;
    return newState;
  };

  const handleCreateNoteSuccessAction = () => {
    const newNote = data;
    const newState = cloneTreeInState();
    const parentNote = tree(newState.rootNote).find(note => newNote.parent.id === note.id);
    parentNote.children.push(newNote);
    return newState;
  };

  const handleDeleteNoteRequestSuccessAction = () => {
    const noteToDelete = data;
    const newState = cloneTreeInState();
    newState.selectedNote = noteToDelete.parent
    noteToDelete.parent.children = noteToDelete.parent.children.filter(
      child => child.id !== noteToDelete.id
    );
    return newState;
  };

  const handleChangeParentNoteRequestSuccess = () => {
    const { rootNote } = state;
    const noteId = data.noteId;
    const newParentId = data.newParentId;
    const targetNote = tree(rootNote).find(node => node.id === noteId);
    const newParent = tree(rootNote).find(node => node.id === newParentId);
    const newState = cloneTreeInState();
    targetNote.parent.children = targetNote.parent.children.filter(
      child => child.id !== targetNote.id
    );
    newParent.children.push(targetNote);

    return {
      ...newState,
      isChangeParentModeActive: false,
      showNoteNameEditor: false,
    };
  }

  switch (type) {
    case ROOT_NOTE_FOUND_ACTION:
      return { ...state, rootNote: data };
    case CHANGE_SELECTED_NOTE_ACTION:
      return { ...state, selectedNote: data };
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
    clonedState.rooNote = { ...state.rootNote };
    clonedState.selectedNote = { ...state.selectedNote };
    return clonedState;
  }
};
