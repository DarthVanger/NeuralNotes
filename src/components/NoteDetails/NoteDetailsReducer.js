import {
  EDITOR_NOTE_NAME_CHANGED_ACTION,
  EDITOR_NOTE_CONTENT_CHANGED_ACTION,
  NOTE_CONTENT_FETCH_SUCCESS_ACTION,
} from 'components/NoteDetails/NoteDetailsActions';
import { CHANGE_SELECTED_NOTE_ACTION } from 'components/NotesMindMap/NotesMindMapActions';

const defaultState = {
  noteName: '',
  noteContent: 'Loading note content...',
};

export const noteDetailsReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case EDITOR_NOTE_NAME_CHANGED_ACTION:
      return {
        ...state,
        noteName: data.newNoteName,
      };
    case CHANGE_SELECTED_NOTE_ACTION:
      return {
        ...state,
        noteName: data.note.name,
      };
    case EDITOR_NOTE_CONTENT_CHANGED_ACTION:
      return {
        ...state,
        noteContent: data.noteContent,
      };
    case NOTE_CONTENT_FETCH_SUCCESS_ACTION:
      return {
        ...state,
        noteContent: data,
      };
    default:
      return state;
  }
};
