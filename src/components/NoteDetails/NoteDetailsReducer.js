import { EDITOR_NOTE_NAME_CHANGED_ACTION } from 'components/NoteDetails/NoteDetailsActions';
import { CHANGE_SELECTED_NOTE_ACTION } from 'components/NotesMindMap/NotesMindMapActions';

const defaultState = {
  noteName: '',
};

export const noteDetailsReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case EDITOR_NOTE_NAME_CHANGED_ACTION:
      return {
        ...state,
        noteName: data.value,
      };
    case CHANGE_SELECTED_NOTE_ACTION:
      return {
        ...state,
        noteName: data.note.name,
      };
    default:
      return state;
  }
};
