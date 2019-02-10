import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import thoughtStorageApi from 'storage/note-storage-api';
import thoughtStorageTree from 'storage/thought-tree';

'use strict';

var appRootFolder = thoughtStorageApi.appRootFolder;
var thoughtsTree = {};

var spinner = siteGlobalLoadingBar.create('thought-storage');

export default {
  restoreFromCache,
  scanDrive,

  // thoughts tree
  findThoughtById: thoughtStorageTree.findThoughtById,
  getThoughts: thoughtStorageTree.getThoughts,
  logTree: thoughtStorageTree.logTree,
  getRoot: thoughtStorageTree.getRoot,
  addChildrenToTree: thoughtStorageTree.addChildrenToTree,

  // api:
  APP_FOLDER_NAME: thoughtStorageApi.APP_FOLDER_NAME,
  fetchParentThought,
  fetchChildThoughts,
  getThoughtContent: thoughtStorageApi.getNoteContent,
  create,
  update: thoughtStorageApi.update,
  remove,
  updateThoughtName,
  getLinkToThought
};

function fetchChildThoughts(thought) {
  return thoughtStorageApi.fetchChildNotes(thought)
    .then(function (children) {
      thoughtStorageTree.addChildrenToTree({
        parentId: thought.id,
        children: children
      });

      return children;
    });
}

function fetchParentThought(thoughtId) {
  return thoughtStorageApi.fetchParentNote(thoughtId)
    .then(function (parentThought) {
      var thought = thoughtStorageTree.findThoughtById(thoughtId);
      if (thought) { // root folder has no parent
        thought.parent = parentThought;
      }
      return thought;
    });
}

function scanDrive() {
  console.debug('thoughtStorage.scanDrive()');
  return thoughtStorageApi.scanDrive()
    .then(function (appRootFolder) {
      thoughtStorageTree.setRoot(appRootFolder);
      console.info('Thought tree root set to the App root folder on Google Drive');
      console.debug('thoughtStorage.scanDrive(), stored thoughtsTree: ', thoughtsTree);
    });
}

function restoreFromCache() {
  return thoughtStorageTree.restoreFromCache();
}

function create(thought, parentThought) {
  console.info('Creating a new thought: ', thought.name);
  return thoughtStorageApi.create(thought, parentThought).then(function (createdThought) {
    console.info('Created new thought: ', thought.name);
    return createdThought;
  });

}

function updateThoughtName(thought) {
  var oldThought = this.findThoughtById(thought.id);
  var newThought = thought;
  return Promise.all([
    thoughtStorageApi.updateFileName(newThought),
    thoughtStorageApi.updateNoteContentFileName(newThought, oldThought)
  ])
    .then(function (responses) {
      oldThought.name = newThought.name;
      return responses;
    });
}

function remove(note) {
  return thoughtStorageApi.remove(note).then(function (result) {
    thoughtStorageTree.deleteNode(note);
    return result;
  });
}

function getLinkToThought(thought) {
  return 'https://drive.google.com/open?id=' + thought.id;
}
