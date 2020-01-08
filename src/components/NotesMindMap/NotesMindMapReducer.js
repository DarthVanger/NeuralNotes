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
} from 'components/NotesMindMap/NotesMindMapActions';
import {
  ROOT_NOTE_FOUND_ACTION,
} from 'components/App/AppActions.js';

const defaultState = {
  selectedNote: {},
  showNoteNameEditor: false,
  noteText: '',
  isChangeParentModeActive: false,
  rootNote: undefined,
  nodes: [],
  edges: []
};

export const notesMindMapReducer = (state = defaultState, { type, data }) => {
  const handleSelectedNoteChildrenFetchedAction = () => {
      const newState = cloneTreeInState();
      const childNotes = data;

      if (childNotes.length) {
        childNotes.forEach(child => {
          newState.nodes.push({ id: child.id, label: child.name, /*group: (hasChildren ? 'parent' : 'children')*/ });
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
    newState.nodes = newState.nodes.filter(node => node.id !== updatedNote.id)
    newState.nodes.push({ id: updatedNote.id, label: updatedNote.name, /*group: (hasChildren ? 'parent' : 'children')*/ });
    return newState;
  };

  const handleCreateNoteSuccessAction = () => {
    const newNote = data;
    const newState = cloneTreeInState();
    newState.nodes.push({ id: newNote.id, label: newNote.name, /*group: (hasChildren ? 'parent' : 'children')*/ });
    newState.edges.push({ from: newNote.parent.id, to: newNote.id });
    return newState;
  };

  const handleDeleteNoteRequestSuccessAction = () => {
    const noteToDelete = data;
    const newState = cloneTreeInState();
    newState.nodes = newState.nodes.filter(node => node.id !== noteToDelete.id) //remove node from nodes array
    newState.edges = newState.edges.filter(edge => edge.to !== noteToDelete.id) //remove edge to the edges array
    newState.edges = newState.edges.filter(edge => edge.from !== noteToDelete.id) //remove edge from the edges array
    return newState;
  };

  const handleChangeParentNoteRequestSuccess = () => {
    const { rootNote } = state;
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
    newState.nodes.push({ id: data.id, label: data.name, /*group: (hasChildren ? 'parent' : 'children')*/ });
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
    clonedState.nodes = [ ...state.nodes ];
    clonedState.edges = [ ...state.edges ];

    return clonedState;
  }
};
