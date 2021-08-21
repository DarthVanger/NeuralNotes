import { FETCHED_NOTE_IS_TRASHED } from 'components/NotesMindMap/NotesMindMapActions';
import { DISMISS_NOTE_IS_TRASHED_DIALOG_ACTION } from './NoteIsTrashedDialogActions';

const defaultState = {
  showDialog: false,
};

export const noteIsTrashedDialogReducer = (state = defaultState, { type }) => {
  switch (type) {
    case FETCHED_NOTE_IS_TRASHED:
      return {
        ...state,
        showDialog: true,
      };
    case DISMISS_NOTE_IS_TRASHED_DIALOG_ACTION:
      return {
        ...state,
        showDialog: false,
      };
    default:
      return state;
  }
};
