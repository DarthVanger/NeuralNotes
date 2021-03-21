export const EDIT_NOTE_BUTTON_CLICKED_ACTION =
  'EDIT_NOTE_BUTTON_CLICKED_ACTION';
export const editNoteButtonClickedAction = note => ({
  type: EDIT_NOTE_BUTTON_CLICKED_ACTION,
  data: { note },
});
