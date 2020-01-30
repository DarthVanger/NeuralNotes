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
import { addGroupTagToNodes, removeNodeFromGraph } from '../../helpers/graph';

const defaultState = {
  selectedNote: {},
  showNoteNameEditor: false,
  noteText: '',
  isChangeParentModeActive: false,
  nodes: [],
  edges: [],
};

export const notesMindMapReducer = (state = defaultState, { type, data }) => {
  const handleSelectedNoteChildrenFetchedAction = () => {
    let nodes = [...state.nodes];
    let edges = [...state.edges];

    const childNotes = data;
    if (childNotes.length) {
      childNotes.forEach(child => {
        nodes = addNodeToGraph(nodes, child);
        edges.push({ from: child.parent.id, to: child.id });
      });
      nodes = addGroupTagToNodes(nodes, edges);
    }
    return {
      ...state,
      nodes,
      edges,
    };
  };

  const handleEditNoteNameAction = () => {
    const noteToEdit = data;
    return {
      ...state,
      showNoteNameEditor: true,
      selectedNote: noteToEdit,
    };
  };

  const handleNoteNameUpdateRequestSuccessAction = () => {
    const updatedNote = data;
    let nodes = [...state.nodes];
    nodes = nodes.map(node => {
      return node.id === data.id ? { ...node, name: updatedNote.name } : node;
    });
    return {
      ...state,
      nodes,
    };
  };

  const handleCreateNoteSuccessAction = () => {
    const newNote = data;
    let nodes = [...state.nodes];
    let edges = [...state.edges];
    edges.push({ from: newNote.parent.id, to: newNote.id });
    nodes = addNodeToGraph(nodes, newNote);
    nodes = nodes.map(node => {
      return node.id === newNote.parent.id && node.isNote
        ? { ...node, group: 'parent' }
        : node;
    });
    return {
      ...state,
      nodes,
      edges,
    };
  };

  const handleDeleteNoteRequestSuccessAction = () => {
    const nodeToDelete = data;
    const { nodes, edges } = removeNodeFromGraph(
      state.nodes,
      state.edges,
      nodeToDelete,
    );
    return {
      ...state,
      nodes,
      edges,
    };
  };

  const handleChangeParentNoteRequestSuccess = () => {
    const noteId = data.noteId;
    const newParentId = data.newParentId;
    let edges = [...state.edges];
    let nodes = [...state.nodes];
    const oldParentId = edges.find(edge => edge.to === noteId).from;
    edges = edges.filter(edge => edge.to !== noteId);
    const oldParentHasChildren = edges.find(edge => edge.from === oldParentId);
    edges.push({ from: newParentId, to: noteId });
    nodes = nodes.map(node => {
      if (node.id === newParentId && node.isNote)
        return { ...node, group: 'parent' };
      else if (node.id === oldParentId && node.isNote && !oldParentHasChildren)
        return { ...node, group: 'children' };
      return node;
    });
    return {
      ...state,
      isChangeParentModeActive: false,
      showNoteNameEditor: false,
      edges,
      nodes,
    };
  };

  const handleChangeSelectedNoteAction = () => {
    return {
      ...state,
      selectedNote: data.note,
    };
  };

  const addRootToGraph = () => {
    let nodes = [...state.nodes];
    addNodeToGraph(nodes, { ...data, isNote: false });
    return {
      ...state,
      nodes,
    };
  };

  const addNodeToGraph = (nodes, newNote) => {
    nodes.push({
      id: newNote.id,
      label: newNote.name,
      name: newNote.name,
      isNote: newNote.isNote,
    });
    return nodes;
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
