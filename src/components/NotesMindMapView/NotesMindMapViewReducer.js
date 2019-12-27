import {
  CHANGE_NOTE_TEXT_ACTION,
  CHANGE_SELECTED_NOTE_ACTION,
  SWITCH_CHANGE_PARENT_MODE_ACTION
} from 'components/NotesMindMapView/NotesMindMapViewActions';

const defaultState = {
  selectedNote: {},
  noteText: '',
  isChangeParentModeActive: false,
};

export const notesMindMapReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case CHANGE_SELECTED_NOTE_ACTION:
      return { ...state, selectedNote: data };
    case CHANGE_NOTE_TEXT_ACTION:
      return { ...state, noteText: data };
    case SWITCH_CHANGE_PARENT_MODE_ACTION:
      return { ...state, isChangeParentModeActive: data.isActive };
    default:
      return state;
  }
};
