import {
  EDITOR_NOTE_NAME_CHANGED_ACTION,
  EDITOR_NOTE_CONTENT_CHANGED_ACTION,
  NOTE_CONTENT_FETCH_SUCCESS_ACTION,
  NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION,
  NOTE_CONTENT_UPDATE_REQUEST_SUCCESS_ACTION,
  CREATE_NOTE_REQUEST_ACTION,
  CREATE_NOTE_SUCCESS_ACTION,
} from 'components/NoteDetails/NoteDetailsActions';
import { CHANGE_SELECTED_NOTE_ACTION } from 'components/NotesMindMap/NotesMindMapActions';
import { ADD_NOTE_BUTTON_CLICKED_ACTION } from 'components/BottomBar/BottomBarActions';

const defaultState = {
  noteName: '',
  noteContent: 'Loading note content...',
  editorState: {
    // If all changes made to the note were saved to Google Drive
    areChangesSaved: true,
    // If the note already exists on Google Drive. False when adding a new note.
    isExistingNote: true,
    // If the http request to create note is in progress.
    isNoteCreationInProgress: false,
  },
};

export const noteDetailsReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case EDITOR_NOTE_NAME_CHANGED_ACTION:
      return {
        ...state,
        noteName: data.newNoteName,
        editorState: {
          ...state.editorState,
          areChangesSaved: false,
        },
      };
    case CHANGE_SELECTED_NOTE_ACTION:
      return {
        ...state,
        noteName: data.note.name,
      };
    case ADD_NOTE_BUTTON_CLICKED_ACTION:
      return {
        ...state,
        noteName: '',
        noteContent: '',
        editorState: {
          ...state.editorState,
          isExistingNote: false,
        },
      };
    case EDITOR_NOTE_CONTENT_CHANGED_ACTION:
      return {
        ...state,
        noteContent: data.noteContent,
        editorState: {
          ...state.editorState,
          areChangesSaved: false,
        },
      };
    case NOTE_CONTENT_FETCH_SUCCESS_ACTION:
      return {
        ...state,
        noteContent: data,
      };
    case NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION:
      return {
        ...state,
        editorState: {
          ...state.editorState,
          areChangesSaved: true,
        },
      };
    case NOTE_CONTENT_UPDATE_REQUEST_SUCCESS_ACTION:
      return {
        ...state,
        editorState: {
          ...state.editorState,
          areChangesSaved: true,
        },
      };
    case CREATE_NOTE_REQUEST_ACTION:
      return {
        ...state,
        editorState: {
          ...state.editorState,
          isNoteCreationInProgress: true,
        },
      };
    case CREATE_NOTE_SUCCESS_ACTION:
      return {
        ...state,
        editorState: {
          ...state.editorState,
          isNoteCreationInProgress: false,
          areChangesSaved: true,
          isExistingNote: true,
        },
      };
    default:
      return state;
  }
};
