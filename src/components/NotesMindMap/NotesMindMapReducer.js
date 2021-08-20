import {
  NOTE_CHILDREN_FETCHED_ACTION,
  SELECTED_NOTE_PARENT_FETCHED_ACTION,
  CHANGE_PARENT_REQUEST_SUCCESS_ACTION,
  CHANGE_PARENT_REQUEST_FAIL_ACTION,
  SEARCH_RESULT_CLICKED,
  INITIAL_NOTE_FETCHED_ACTION,
  RESET_MIND_MAP_TO_ROOT_NODE,
  NOTE_WITH_CHILDREN_AND_PARENT_FETCH_SUCCESS_ACTION,
  FETCH_NOTE_ACTION,
  SELECT_NOTE_ACTION,
  FETCHED_NOTE_NOT_FOUND_ACTION,
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

import {
  CHANGE_NOTE_PARENT_PAGE_MOUNTED,
  CHANGE_NOTE_PARENT_PAGE_UNMOUNTED,
} from 'components/NotesPage/ChangeNoteParentPage/ChangeNoteParentPageActions';

import { NOTES_GRAPH_LOADED_FROM_LOCAL_STORAGE_ACTION } from 'components/NotesPage/NotesPageActions';

import { DISMISS_NOTE_IS_TRASHED_DIALOG_ACTION } from 'components/NotesMindMap/notifications/NoteIsTrashedDialog/NoteIsTrashedDialogActions';
import { NOTE_IS_PERMANENTLY_DELETED_DIALOG_CLOSED } from 'components/NotesMindMap/notifications/NoteIsPermanentlyDeletedDialog/NoteIsPermanentlyDeletedDialogActions';

import {
  removeNodeFromGraph,
  removeEdge,
  addEdge,
  getParentNode,
  getRootNode,
} from '../../helpers/graph';

import noteStorage from 'storage/noteStorage';

const defaultState = {
  selectedNote: {},
  isChangeParentModeActive: false,
  nodes: [],
  edges: [],
  isSelectedNoteLoading: false,
  mindMapLoadedFromMemory: false,
};

export const notesMindMapReducer = (
  state = defaultState,
  { type, data, payload },
) => {
  const handleNotesGraphLoadedFromLocalStorage = () => {
    const { graph, selectedNote } = data;
    const { nodes, edges } = graph;
    const updatedNodes = graph.nodes.map(node => ({
      ...node,
      wereChildrenFetched: false,
    }));

    return {
      ...state,
      nodes: updatedNodes,
      edges,
      selectedNote,
      mindMapLoadedFromMemory: true,
    };
  };

  const handleNoteWithChildrenAndParentFetchSuccess = () => {
    const { note, children, parentNote } = data;

    const state1 = updateNoteChildren(state, note, children);
    const state2 = updateNoteParent(state1, note, parentNote);

    const nodes = state2.nodes.map(n => {
      if (n.id === note.id) {
        return {
          ...note,
          wereChildrenFetched: true,
        };
      } else {
        return n;
      }
    });

    return {
      ...state2,
      nodes,
      isSelectedNoteLoading: false,
    };
  };

  const updateNoteChildren = (state, note, children) => {
    let nodes = [...state.nodes];
    let edges = [...state.edges];

    children.forEach(child => {
      // if the child is already on the mind map, do nothing
      if (nodes.find(n => n.id === child.id)) return;

      nodes = addNodeToGraph(nodes, child);
      edges.push({
        from: note.id,
        to: child.id,
        fromNode: note,
        toNode: child,
      });
    });

    return {
      ...state,
      nodes,
      edges,
    };
  };

  const updateNoteParent = (state, note, fetchedParentNote) => {
    // the app folder has no parent, nothing to update
    if (noteStorage.isAppFolder(note)) return state;

    const { nodes, edges } = state;

    const graph = { nodes, edges };

    const currentParentNote = getParentNode(graph, note);
    const fetchedParentNoteInGraph = nodes.find(
      node => node.id === fetchedParentNote.id,
    );

    // fetched note's parent is already its parent in the graph, do nothing
    if (currentParentNote?.id === fetchedParentNote.id) {
      return state;
    }

    let updatedNodes = nodes;
    let updatedEdges = edges;

    // fetched parent is not in the graph yet, add it with edge to selected note
    if (!fetchedParentNoteInGraph) {
      updatedNodes = addNodeToGraph(nodes, fetchedParentNote);
      updatedEdges = addEdge(graph, {
        from: fetchedParentNote,
        to: note,
      });
    }

    // note had a parent different from the fetched one, remove edge to old parent
    if (currentParentNote && currentParentNote.id !== fetchedParentNote.id) {
      updatedEdges = removeEdge(graph, {
        from: currentParentNote,
        to: note,
      });
    }

    return {
      ...state,
      nodes: updatedNodes,
      edges: updatedEdges,
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
    nodes = addNodeToGraph(nodes, { ...newNote });
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
      {
        nodes: state.nodes,
        edges: state.edges,
      },
      nodeToDelete,
    );

    return {
      ...state,
      nodes,
      edges,
      selectedNote: getParentNode(
        { nodes: state.nodes, edges: state.edges },
        nodeToDelete,
      ),
    };
  };

  const handleChangeParentNoteRequestSuccess = () => {
    const { note, newParent } = data;
    let edges = [...state.edges];
    let nodes = [...state.nodes];
    edges = edges.filter(edge => edge.to !== note.id);
    edges.push({ from: newParent.id, to: note.id });
    return {
      ...state,
      isChangeParentModeActive: false,
      edges,
      nodes,
    };
  };

  const addInitialNoteToGraph = () => {
    let nodes = state.nodes;
    const updatedNodes = addNodeToGraph(nodes, { ...data });

    return {
      ...state,
      nodes: updatedNodes,
      selectedNote: updatedNodes[0],
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

  const removeSelectedNote = () => {
    const { nodes, edges, selectedNote } = state;
    const graph = { nodes, edges };

    const updatedGraph = removeNodeFromGraph(graph, selectedNote);

    return {
      ...state,
      nodes: updatedGraph.nodes,
      edges: updatedGraph.edges,
    };
  };

  switch (type) {
    case INITIAL_NOTE_FETCHED_ACTION:
      return addInitialNoteToGraph();
    case NOTES_GRAPH_LOADED_FROM_LOCAL_STORAGE_ACTION:
      return handleNotesGraphLoadedFromLocalStorage();
    case NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION:
      return handleNoteNameUpdateRequestSuccessAction({ state, data });
    case CREATE_NOTE_SUCCESS_ACTION:
      return handleCreateNoteSuccessAction({ state, data });
    case DELETE_NOTE_REQUEST_SUCCESS_ACTION:
      return handleDeleteNoteRequestSuccessAction({ state, data });
    case CHANGE_PARENT_BUTTON_CLICKED_ACTION:
      return { ...state, isChangeParentModeActive: true };
    case CHANGE_NOTE_PARENT_PAGE_MOUNTED:
      // for case when user refreshes the change parent page
      return { ...state, isChangeParentModeActive: true };
    case CHANGE_NOTE_PARENT_PAGE_UNMOUNTED:
      // for case when user clicks "back" on the change parent page
      return { ...state, isChangeParentModeActive: false };
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
    case RESET_MIND_MAP_TO_ROOT_NODE:
      return {
        ...state,
        nodes: [],
        edges: [],
      };
    case NOTE_WITH_CHILDREN_AND_PARENT_FETCH_SUCCESS_ACTION:
      return handleNoteWithChildrenAndParentFetchSuccess();
    case FETCH_NOTE_ACTION:
      return {
        ...state,
        isSelectedNoteLoading: true,
      };
    case SELECT_NOTE_ACTION:
      return {
        ...state,
        selectedNote: data,
      };
    case DISMISS_NOTE_IS_TRASHED_DIALOG_ACTION:
      return removeSelectedNote();
    case NOTE_IS_PERMANENTLY_DELETED_DIALOG_CLOSED:
      return removeSelectedNote();
    default:
      return state;
  }
};
