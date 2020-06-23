import {
  EDITOR_NOTE_NAME_CHANGED_ACTION,
  EDITOR_NOTE_CONTENT_CHANGED_ACTION,
} from 'components/NoteDetails/NoteDetailsActions';
import {
  CHANGE_SELECTED_NOTE_ACTION,
  CHANGE_NOTE_TEXT_ACTION,
} from 'components/NotesMindMap/NotesMindMapActions';

const defaultState = {
  noteName: '',
  noteText: '',
};

export const noteDetailsReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case EDITOR_NOTE_NAME_CHANGED_ACTION:
      return {
        ...state,
        noteName: data,
      };
    case CHANGE_SELECTED_NOTE_ACTION:
      return {
        ...state,
        noteName: data.note.name,
      };
    case EDITOR_NOTE_CONTENT_CHANGED_ACTION:
      console.log('State', state);
      console.log('Data', data);
      return {
        ...state,
        noteText: data,
      };
    case CHANGE_NOTE_TEXT_ACTION:
      console.log('State', state);
      console.log('Data', data);
      return {
        ...state,
        noteText: data,
      };
    default:
      return state;
  }
};
