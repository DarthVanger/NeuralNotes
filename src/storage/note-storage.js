// import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import noteStorageApi from 'storage/note-storage-api';
import noteStorageTree from 'storage/note-tree';

'use strict';

// var appRootFolder = noteStorageApi.appRootFolder;
const notesTree = {};

// var spinner = siteGlobalLoadingBar.create('note-storage');

export default {
  restoreFromCache,
  scanDrive,

  // notes tree
  findNoteById: noteStorageTree.findNoteById,
  getNotes: noteStorageTree.getNotes,
  logTree: noteStorageTree.logTree,
  getRoot: noteStorageTree.getRoot,
  addChildrenToTree: noteStorageTree.addChildrenToTree,

  // api:
  APP_FOLDER_NAME: noteStorageApi.APP_FOLDER_NAME,
  fetchParentNote,
  fetchChildNotes,
  getNoteContent: noteStorageApi.getNoteContent,
  create,
  update: noteStorageApi.update,
  remove,
  updateNoteName,
  getLinkToNote
};

function fetchChildNotes(note) {
  return noteStorageApi.fetchChildNotes(note)
    .then(function (children) {
      noteStorageTree.addChildrenToTree({
        parentId: note.id,
        children: children
      });

      return children;
    });
}

function fetchParentNote(noteId) {
  return noteStorageApi.fetchParentNote(noteId)
    .then(function (parentNote) {
      var note = noteStorageTree.findNoteById(noteId);
      if (note) { // root folder has no parent
        note.parent = parentNote;
      }
      return note;
    });
}

function scanDrive() {
  console.debug('noteStorage.scanDrive()');
  return noteStorageApi.scanDrive()
    .then(function (appRootFolder) {
      noteStorageTree.setRoot(appRootFolder);
      console.info('Note tree root set to the App root folder on Google Drive');
      console.debug('noteStorage.scanDrive(), stored notesTree: ', notesTree);
    });
}

function restoreFromCache() {
  return noteStorageTree.restoreFromCache();
}

function create(note, parentNote) {
  console.info('Creating a new note: ', note.name);
  return noteStorageApi.create(note, parentNote).then(function (createdNote) {
    console.info('Created new note: ', note.name);
    return createdNote;
  });

}

function updateNoteName(note) {
  var oldNote = this.findNoteById(note.id);
  var newNote = note;
  return Promise.all([
    noteStorageApi.updateFileName(newNote),
    noteStorageApi.updateNoteContentFileName(newNote, oldNote)
  ])
    .then(function (responses) {
      oldNote.name = newNote.name;
      return responses;
    });
}

function remove(note) {
  return noteStorageApi.remove(note).then(function (result) {
    noteStorageTree.deleteNode(note);
    return result;
  });
}

function getLinkToNote(note) {
  return 'https://drive.google.com/open?id=' + note.id;
}
