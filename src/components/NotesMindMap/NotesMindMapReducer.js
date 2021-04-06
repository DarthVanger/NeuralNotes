import {
  CHANGE_SELECTED_NOTE_ACTION,
  SELECTED_NOTE_CHILDREN_FETCHED_ACTION,
  SELECTED_NOTE_PARENT_FETCHED_ACTION,
  CHANGE_PARENT_REQUEST_SUCCESS_ACTION,
  CHANGE_PARENT_REQUEST_FAIL_ACTION,
  SEARCH_RESULT_CLICKED,
  ROOT_NOTE_FOUND_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';

import { UploadsActions } from 'components/Uploads/UploadsActions';

import {
  CHANGE_PARENT_BUTTON_CLICKED_ACTION,
  DELETE_NOTE_REQUEST_SUCCESS_ACTION,
} from 'components/BottomBar/BottomBarActions';

import {
  CREATE_NOTE_SUCCESS_ACTION,
  NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION,
} from 'components/NoteDetails/NoteDetailsActions';

import { addGroupTagToNodes, removeNodeFromGraph } from '../../helpers/graph';

import noteStorage from 'storage/noteStorage';

const defaultState = {
  selectedNote: {},
  isChangeParentModeActive: false,
  nodes: [],
  edges: [],
};

export const notesMindMapReducer = (
  state = defaultState,
  { type, data, payload },
) => {
  const handleSelectedNoteChildrenFetchedAction = () => {
    let nodes = [...state.nodes];
    let edges = [...state.edges];

    const selectedNoteInNodes = nodes.find(
      node => node.id === state.selectedNote.id,
    );
    nodes[nodes.indexOf(selectedNoteInNodes)] = {
      ...selectedNoteInNodes,
      wereChildrenFetched: true,
    };

    const childNotes = data;
    if (childNotes.length) {
      childNotes.forEach(child => {
        // when a an initial note is loaded, its parent is loaded
        // but without children. When the parent is clicked,
        // the children are fetched, including the initial note,
        // which is already present in the graph. Omit it
        // when adding nodes and edges, to avoid having it twice.
        if (nodes.find(node => node.id === child.id)) return;

        nodes = addNodeToGraph(nodes, child);
        edges.push({
          from: child.parent.id,
          to: child.id,
          fromNode: child.parent,
          toNode: child,
        });
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
    let updatedNodes = [...state.nodes];
    updatedNodes = updatedNodes.map(node => {
      return node.id === updatedNote.id
        ? { ...node, name: updatedNote.name }
        : node;
    });
    return {
      ...state,
      nodes: updatedNodes,
      selectedNote: updatedNote,
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
      selectedNote: newNote,
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
      nodes: addNodeToGraph(nodes, { ...data }),
    };
  };

  const addNodeToGraph = (nodes, newNote) => {
    let newNodes = [...nodes];
    newNodes.push({
      id: newNote.id,
      name: newNote.name,
      isUploadedFile: noteStorage.isUploadedFile(newNote),
      parent: newNote.parent,
    });
    return newNodes;
  };

  const prependUploadingToFileName = filename => `[Uploading...] ${filename}`;

  const handleFileUploadStart = () => {
    const { files } = payload;
    let nodes = state.nodes;
    const edges = [...state.edges];
    files.forEach(file => {
      const newNode = {
        id: `upload-in-progress-${Date.now()}`,
        name: prependUploadingToFileName(file.name),
        parent: state.selectedNote,
        isUploadedFile: true,
        isInProgressOfUpload: true,
      };

      nodes = addNodeToGraph(nodes, newNode);
      edges.push({ from: newNode.parent.id, to: newNode.id });
    });
    return {
      ...state,
      nodes,
      edges,
    };
  };

  const handleFileUploadSuccess = () => {
    const uploadedFile = payload.result;
    const nodes = [...state.nodes];
    const edges = [...state.edges];
    // TODO: ideally should be searching by id...
    const nodeToUpdate = nodes.find(
      node => node.name === prependUploadingToFileName(uploadedFile.name),
    );
    nodes[nodes.indexOf(nodeToUpdate)] = {
      ...nodeToUpdate,
      id: uploadedFile.id,
      name: uploadedFile.name,
      isInProgressOfUpload: false,
    };
    const edgeToUpdate = edges.find(edge => edge.to === nodeToUpdate.id);
    edges[edges.indexOf(edgeToUpdate)] = {
      ...edgeToUpdate,
      to: uploadedFile.id,
    };
    return {
      ...state,
      nodes,
      edges,
    };
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
    case UploadsActions.list.addedFiles().type:
      return handleFileUploadStart();
    case UploadsActions.file.uploadSuccess().type:
      return handleFileUploadSuccess();
    default:
      return state;
  }
};
