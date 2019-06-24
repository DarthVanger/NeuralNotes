import {
  CHANGE_NOTE_TEXT_ACTION,
  CHANGE_SELECTED_NOTE_ACTION
} from 'components/NotesMindMapView/NotesMindMapViewActions';

const defaultState = {
  selectedNote: {},
  noteText: '',
};

export const notesMindMapReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case CHANGE_SELECTED_NOTE_ACTION:
      return { ...state, selectedNote: data };
    case CHANGE_NOTE_TEXT_ACTION:
      return { ...state, noteText: data };
    default:
      return state;
  }
};
