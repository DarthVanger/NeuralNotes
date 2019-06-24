export const CHANGE_NOTE_TEXT_ACTION  = 'CHANGE_NOTE_TEXT_ACTION';
export const REQUEST_NOTE_TEXT_ACTION  = 'REQUEST_NOTE_TEXT_ACTION';
export const CHANGE_SELECTED_NOTE_ACTION  = 'CHANGE_SELECTED_NOTE_ACTION';

export const changeNoteTextAction = data => ({ type: CHANGE_NOTE_TEXT_ACTION, data });
export const changeSelectedNoteAction = data => ({ type: CHANGE_SELECTED_NOTE_ACTION, data });
