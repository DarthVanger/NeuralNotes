import {
  CHANGE_PARENT_REQUEST_SUCCESS_ACTION,
  CHANGE_PARENT_REQUEST_FAIL_ACTION,
  SEARCH_RESULT_CLICKED,
  INITIAL_NOTE_FETCHED_ACTION,
  RESET_MIND_MAP_TO_ROOT_NODE,
  NOTE_WITH_CHILDREN_AND_PARENT_FETCH_SUCCESS_ACTION,
  FETCH_NOTE_ACTION,
  SELECT_NOTE_ACTION,
  FETCH_NOTE_CHILDREN_AND_PARENT_REQUEST_FAIL_ACTION,
  NOTE_FETCH_FAIL_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';

import { UploadsActions } from 'components/Uploads/UploadsActions';

import {
  CHANGE_PARENT_BUTTON_CLICKED_ACTION,
  DELETE_NOTE_REQUEST_SUCCESS_ACTION,
  ADD_NOTE_BUTTON_CLICKED_ACTION,
} from 'components/BottomBar/BottomBarActions';

import {
  CREATE_NOTE_SUCCESS_ACTION,
  NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION,
  EDITOR_NOTE_NAME_CHANGED_ACTION,
  NEW_NOTE_DISCARDED_ACTION,
  CREATE_NOTE_REQUEST_FAIL_ACTION,
  CREATE_NOTE_REQUEST_ACTION,
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
  getNodeChildren,
  replaceNode,
} from '../../helpers/graph';

import noteStorage from 'storage/noteStorage';

const defaultState = {
  selectedNote: {},
  isChangeParentModeActive: false,
  nodes: [],
  edges: [],
  mindMapLoadedFromMemory: false,
};

export const notesMindMapReducer = (
  state = defaultState,
  { type, data, payload },
) => {
  const handleNotesGraphLoadedFromLocalStorage = () => {
    const { graph, selectedNote } = data;
    const { nodes, edges } = graph;
    const updatedNodes = nodes.map(node => ({
      ...node,
      wereChildrenFetched: false,
    }));

    const updatedSelectedNote = {
      ...selectedNote,
      wereChildrenFetched: false,
    };

    return {
      ...state,
      nodes: updatedNodes,
      edges,
      selectedNote: updatedSelectedNote,
      mindMapLoadedFromMemory: true,
    };
  };

  const handleNoteWithChildrenAndParentFetchSuccess = () => {
    const { note, children, parentNote } = data;
    const { selectedNote } = state;

    const state1 = updateNoteChildren(state, note, children);
    const state2 = updateNoteParent(state1, note, parentNote);

    const updatedNote = {
      ...note,
      wereChildrenFetched: true,
      isLoading: false,
    };

    const nodes = state2.nodes.map(n => {
      if (n.id === note.id) {
        return updatedNote;
      } else {
        return n;
      }
    });

    return {
      ...state2,
      nodes,
      selectedNote: selectedNote.id === note.id ? updatedNote : selectedNote,
    };
  };

  const updateNoteChildren = (state, note, children) => {
    let nodes = [...state.nodes];
    let edges = [...state.edges];

    const graph = { nodes, edges };

    const currentNoteChildren = getNodeChildren(graph, note);

    // remove any children that are currently in the graph,
    // but are not in the fetched children
    const newChildrenIds = children.map(c => c.id);
    currentNoteChildren.forEach(currentChild => {
      if (!newChildrenIds.includes(currentChild.id)) {
        const updatedGraph = removeNodeFromGraph(graph, currentChild);
        nodes = updatedGraph.nodes;
        edges = updatedGraph.edges;
      }
    });

    // add children that were fetched, but are not in the graph
    children.forEach(child => {
      // if the child is already on the mind map, replace it
      // with the freshly fetched one, as it might have been renamed
      const existingChild = nodes.find(n => n.id === child.id);
      if (existingChild) {
        nodes[nodes.indexOf(existingChild)] = { ...child };
        return;
      }

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
    };
  };

  const handleCreateNoteSuccessAction = () => {
    const { newNote, unsavedNoteInGraph } = data;

    let nodes = [...state.nodes];
    let edges = [...state.edges];

    nodes.forEach(node => {
      if (node.id === unsavedNoteInGraph.id) {
        nodes[nodes.indexOf(node)] = {
          ...newNote,
          isSaving: false,
        };
        const edge = edges.find(e => e.to === node.id);
        edges[edges.indexOf(edge)].to = newNote.id;
      }
    });

    const updatedSelectedNote =
      state.selectedNote.id === unsavedNoteInGraph.id
        ? newNote
        : state.selectedNote;

    return {
      ...state,
      nodes,
      edges,
      selectedNote: updatedSelectedNote,
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

  const convertGoogleDriveFileToNote = file => {
    return {
      id: file.id,
      name: file.name,
      isUploadedFile: noteStorage.isUploadedFile(file),
      parent: file.parent,
    };
  };

  const addNodeToGraph = (nodes, newNote) => {
    let newNodes = [...nodes];
    newNodes.push(convertGoogleDriveFileToNote(newNote));
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

  const handleAddNoteButtonClicked = () => {
    const parentNote = data.parent;
    const graph = { nodes: state.nodes, edges: state.edges };
    const newNote = {
      id: `new-note-${Math.floor(Math.random() * 1000000)}`,
      name: 'New note',
      parent: { id: parentNote.id },
    };

    const updatedNodes = addNodeToGraph(graph.nodes, newNote);
    const updatedEdges = addEdge(graph, {
      from: parentNote,
      to: newNote,
    });

    return {
      ...state,
      nodes: updatedNodes,
      edges: updatedEdges,
      selectedNote: newNote,
    };
  };

  const handleEditorNoteNameChanged = () => {
    const graph = { nodes: state.nodes, edges: state.edges };
    const { note } = data;
    const updatedNote = { ...note, name: data.newNoteName };
    const updatedNodes = replaceNode(graph, note, updatedNote);

    const updatedSelectedNote =
      state.selectedNote.id === note.id ? updatedNote : state.selectedNote;

    return {
      ...state,
      nodes: updatedNodes,
      selectedNote: updatedSelectedNote,
    };
  };

  const handleNewNoteDiscarded = () => {
    const discardedNewNote = data;
    const { nodes, edges } = state;
    const graph = { nodes, edges };

    const updatedGraph = removeNodeFromGraph(graph, discardedNewNote);
    const discardedNewNoteParent = getParentNode(graph, discardedNewNote);

    return {
      ...state,
      nodes: updatedGraph.nodes,
      edges: updatedGraph.edges,
      selectedNote: discardedNewNoteParent,
    };
  };

  const updateNote = (node, updates) => {
    const nodeInGraph = state.nodes.find(n => n.id === node.id);
    const updatedNode = { ...nodeInGraph, ...updates };
    const { selectedNote } = state;

    return {
      ...state,
      nodes: replaceNode({ nodes: state.nodes }, node, updatedNode),
      selectedNote: selectedNote.id === node.id ? updatedNode : selectedNote,
    };
  };

  switch (type) {
    case INITIAL_NOTE_FETCHED_ACTION:
      return addInitialNoteToGraph();
    case NOTES_GRAPH_LOADED_FROM_LOCAL_STORAGE_ACTION:
      return handleNotesGraphLoadedFromLocalStorage();
    case NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION:
      return handleNoteNameUpdateRequestSuccessAction({ state, data });
    case CREATE_NOTE_REQUEST_ACTION:
      return updateNote(data.unsavedNoteInGraph, { isSaving: true });
    case CREATE_NOTE_SUCCESS_ACTION:
      return handleCreateNoteSuccessAction({ state, data });
    case CREATE_NOTE_REQUEST_FAIL_ACTION:
      return updateNote(data.unsavedNoteInGraph, {
        didNoteSaveFail: true,
        isSaving: false,
      });
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
      const searchResult = data;
      const searchResultInGraph = state.nodes.find(
        n => n.id === searchResult.id,
      );

      // If search result is in graph, do nothing: Saga dispatches the select note action,
      // so the note will be simply selected and that's it.
      if (searchResultInGraph) {
        return state;
      }

      // If search result is not in the graph, clear the graph and show only the search result,
      // because mind map is currently capable of showing only 1 tree (there should be 1 root).
      return {
        ...state,
        nodes: [searchResult],
        edges: [],
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
      return updateNote(data, { isLoading: true });
    case SELECT_NOTE_ACTION:
      return {
        ...state,
        selectedNote: data,
      };
    case DISMISS_NOTE_IS_TRASHED_DIALOG_ACTION:
      return removeSelectedNote();
    case NOTE_IS_PERMANENTLY_DELETED_DIALOG_CLOSED:
      return removeSelectedNote();
    case ADD_NOTE_BUTTON_CLICKED_ACTION:
      return handleAddNoteButtonClicked();
    case EDITOR_NOTE_NAME_CHANGED_ACTION:
      return handleEditorNoteNameChanged();
    case NEW_NOTE_DISCARDED_ACTION:
      return handleNewNoteDiscarded();
    case FETCH_NOTE_CHILDREN_AND_PARENT_REQUEST_FAIL_ACTION:
      return updateNote(data, { isLoading: false });
    case NOTE_FETCH_FAIL_ACTION:
      return updateNote(data, { isLoading: false });
    default:
      return state;
  }
};
