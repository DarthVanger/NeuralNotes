export const CHANGE_NOTE_PARENT_PAGE_MOUNTED =
  'CHANGE_NOTE_PARENT_PAGE_MOUNTED';

export const CHANGE_NOTE_PARENT_PAGE_UNMOUNTED =
  'CHANGE_NOTE_PARENT_PAGE_UNMOUNTED';

export const changeNoteParentPageMountedAction = () => ({
  type: CHANGE_NOTE_PARENT_PAGE_MOUNTED,
});

export const changeNoteParentPageUnmountedAction = () => ({
  type: CHANGE_NOTE_PARENT_PAGE_UNMOUNTED,
});
