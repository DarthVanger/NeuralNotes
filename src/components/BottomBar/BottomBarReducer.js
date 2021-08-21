import {
  DELETE_NOTE_REQUEST_SUCCESS_ACTION,
  NOTE_DELETE_NOTIFICATION_CLOSED,
} from './BottomBarActions';

const defaultState = {
  showNoteDeletedNotification: false,
};

export const bottomBarReducer = (state = defaultState, { type }) => {
  switch (type) {
    case DELETE_NOTE_REQUEST_SUCCESS_ACTION:
      return {
        ...state,
        showNoteDeletedNotification: true,
      };
    case NOTE_DELETE_NOTIFICATION_CLOSED:
      return {
        ...state,
        showNoteDeletedNotification: false,
      };
    default:
      return state;
  }
};
