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
  areChangesSaved: true,
  isNewNote: false,
  isNoteCreationInProgress: false,
};

export const noteDetailsReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case EDITOR_NOTE_NAME_CHANGED_ACTION:
      return {
        ...state,
        noteName: data.newNoteName,
        areChangesSaved: false,
      };
    case CHANGE_SELECTED_NOTE_ACTION:
      return {
        ...state,
        noteName: data.note.name,
      };
    case ADD_NOTE_BUTTON_CLICKED_ACTION:
      return {
        ...state,
        isNewNote: true,
        noteName: '',
        noteContent: '',
      };
    case EDITOR_NOTE_CONTENT_CHANGED_ACTION:
      return {
        ...state,
        noteContent: data.noteContent,
        areChangesSaved: false,
      };
    case NOTE_CONTENT_FETCH_SUCCESS_ACTION:
      return {
        ...state,
        noteContent: data,
      };
    case NOTE_NAME_UPDATE_REQUEST_SUCCESS_ACTION:
      return {
        ...state,
        areChangesSaved: true,
      };
    case NOTE_CONTENT_UPDATE_REQUEST_SUCCESS_ACTION:
      return {
        ...state,
        areChangesSaved: true,
      };
    case CREATE_NOTE_REQUEST_ACTION:
      return {
        ...state,
        isNoteCreationInProgress: true,
      };
    case CREATE_NOTE_SUCCESS_ACTION:
      return {
        ...state,
        isNewNote: false,
        isNoteCreationInProgress: false,
        areChangesSaved: true,
      };
    default:
      return state;
  }
};
