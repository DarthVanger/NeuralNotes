import { FETCHED_NOTE_NOT_FOUND_ACTION } from 'components/NotesMindMap/NotesMindMapActions';
import { NOTE_IS_PERMANENTLY_DELETED_DIALOG_CLOSED } from './NoteIsPermanentlyDeletedDialogActions';

const defaultState = {
  showDialog: false,
};

export const noteIsPermanentlyDeletedReducer = (
  state = defaultState,
  { type, data },
) => {
  switch (type) {
    case FETCHED_NOTE_NOT_FOUND_ACTION:
      return {
        ...state,
        showDialog: true,
      };
    case NOTE_IS_PERMANENTLY_DELETED_DIALOG_CLOSED:
      return {
        ...state,
        showDialog: false,
      };
    default:
      return state;
  }
};
