import {
  CHANGE_NOTE_TEXT_ACTION,
  CHANGE_SELECTED_NOTE_ACTION,
  SELECTED_NOTE_CHILDREN_FETCHED_ACTION,
  SELECTED_NOTE_PARENT_FETCHED_ACTION,
  NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION,
  CREATE_NOTE_SUCCESS_ACTION,
  DELETE_NOTE_REQUEST_SUCCESS_ACTION,
  CHANGE_PARENT_BUTTON_CLICKED_ACTION,
  CHANGE_PARENT_REQUEST_SUCCESS_ACTION,
  CHANGE_PARENT_REQUEST_FAIL_ACTION,
  SEARCH_RESULT_CLICKED,
  ROOT_NOTE_FOUND_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';

import { addGroupTagToNodes, removeNodeFromGraph } from '../../helpers/graph';

const defaultState = {
  selectedNote: {},
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

  const handleSelectedNoteParentFetchedAction = () => {
    let nodes = [...state.nodes];
    let edges = [...state.edges];

    const parentNote = data;
    if (parentNote) {
      nodes = addNodeToGraph(nodes, parentNote);
      edges.push({ from: parentNote.id, to: state.selectedNote.id });
      nodes = addGroupTagToNodes(nodes, edges);
    }
    return {
      ...state,
      nodes,
      edges,
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
    nodes = addNodeToGraph(nodes, { ...newNote, group: 'children' });
    nodes = addGroupTagToNodes(nodes, edges);
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
    edges = edges.filter(edge => edge.to !== noteId);
    edges.push({ from: newParentId, to: noteId });
    nodes = addGroupTagToNodes(nodes, edges);
    return {
      ...state,
      isChangeParentModeActive: false,
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
    let nodes = state.nodes;
    return {
      ...state,
      nodes: addNodeToGraph(nodes, { ...data, isNote: false }),
    };
  };

  const addNodeToGraph = (nodes, newNote) => {
    let newNodes = [...nodes];
    newNodes.push({
      id: newNote.id,
      label: newNote.name,
      name: newNote.name,
      isNote: newNote.isNote,
      parent: newNote.parent,
    });
    return newNodes;
  };

  switch (type) {
    case ROOT_NOTE_FOUND_ACTION:
      return addRootToGraph();
    case CHANGE_SELECTED_NOTE_ACTION:
      return handleChangeSelectedNoteAction();
    case SELECTED_NOTE_CHILDREN_FETCHED_ACTION:
      return handleSelectedNoteChildrenFetchedAction(data);
    case SELECTED_NOTE_PARENT_FETCHED_ACTION:
      return handleSelectedNoteParentFetchedAction(data);
    case CHANGE_NOTE_TEXT_ACTION:
      return { ...state, noteText: data };
    case NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION:
      return handleNoteNameUpdateRequestSuccessAction({ state, data });
    case CREATE_NOTE_SUCCESS_ACTION:
      return handleCreateNoteSuccessAction({ state, data });
    case DELETE_NOTE_REQUEST_SUCCESS_ACTION:
      return handleDeleteNoteRequestSuccessAction({ state, data });
    case CHANGE_PARENT_BUTTON_CLICKED_ACTION:
      return { ...state, isChangeParentModeActive: true };
    case CHANGE_PARENT_REQUEST_SUCCESS_ACTION:
      return handleChangeParentNoteRequestSuccess();
    case CHANGE_PARENT_REQUEST_FAIL_ACTION:
      return { ...state, isChangeParentModeActive: false };
    case SEARCH_RESULT_CLICKED:
      return {
        nodes: [data.note],
        edges: [],
        selectedNote: data.note,
      };
    default:
      return state;
  }
};
