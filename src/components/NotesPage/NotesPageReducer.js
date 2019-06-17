import {
  CHANGE_USER_HELP_SEEN_ACTION,
  CHANGE_NOTE_TEXT_ACTION,
  CHANGE_SELECTED_NOTE_ACTION
} from 'components/NotesPage/NotesPageActions';

const defaultState = {
  selectedNote: {},
  noteText: '',
  isHelpViewed: false
};

export const notesReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case CHANGE_USER_HELP_SEEN_ACTION:
      return { ...state, isHelpViewed: data };
    case CHANGE_SELECTED_NOTE_ACTION:
      return { ...state, selectedNote: data };
    case CHANGE_NOTE_TEXT_ACTION:
      return { ...state, noteText: data };
    default:
      return state;
  }
};
