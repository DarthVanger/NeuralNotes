import {
  CHANGE_USER_HELP_SEEN_ACTION
} from 'components/NotesPage/NotesPageActions';

const defaultState = {
  isHelpViewed: false
};

export const notesReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case CHANGE_USER_HELP_SEEN_ACTION:
      return { ...state, isHelpViewed: data };
    default:
      return state;
  }
};
