import noteStorageApi from 'storage/noteStorageAPI';

('use strict');

// TODO: Better to avoid using export default
export default {
  scanDrive,

  // api:
  APP_FOLDER_NAME: noteStorageApi.APP_FOLDER_NAME,
  fetchParentNote,
  fetchChildNotes,
  getNoteContent: noteStorageApi.getNoteContent,
  create,
  update: noteStorageApi.update,
  remove,
  move,
  updateNoteName,
  getLinkToNote,
  isAppFolder,
  isUploadedFile,
};

function isUploadedFile(file) {
  return file.mimeType !== 'application/vnd.google-apps.folder';
}

function isAppFolder(note) {
  return note.name === noteStorageApi.APP_FOLDER_NAME;
}

function fetchChildNotes(note) {
  return noteStorageApi.fetchChildNotes(note);
}

function fetchParentNote(note) {
  return noteStorageApi.fetchParentNote(note);
}

/**
 * Find app root folder on Google Drive and return it,
 * or create a fresh one and return it.
 */
function scanDrive() {
  return noteStorageApi.scanDrive();
}

function create(note, parentNote) {
  console.info('Creating a new note: ', note.name);
  return noteStorageApi.create(note, parentNote).then(function(createdNote) {
    console.info('Created new note: ', note.name);
    return createdNote;
  });
}

function updateNoteName({ note, newName }) {
  return Promise.all([
    noteStorageApi.updateFileName({ id: note.id, name: newName }),
    noteStorageApi.updateNoteContentFileName({ note, newName }),
  ]).then(function(responses) {
    console.log('resonses for note name update: ', responses);
    const newNote = { ...note };
    newNote.name = newName;
    return newNote;
  });
}

function remove(note) {
  return noteStorageApi.remove(note).then(result => {
    return result;
  });
}

function move({ noteId, newParentId }) {
  return new Promise((resolve, reject) => {
    noteStorageApi
      .move(noteId, newParentId)
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

function getLinkToNote({ id }) {
  return 'https://drive.google.com/open?id=' + id;
}
