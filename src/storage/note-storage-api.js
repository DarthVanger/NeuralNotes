/* global gapi */
import _ from 'underscore';
import service from 'storage/note-storage-api';
import googleDriveApi from 'api/google-drive-api';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import uiErrorNotification from 'ui/ui-error-notification';

'use strict';

let APP_FOLDER_NAME = 'NeuralNotes';

let spinner = siteGlobalLoadingBar.create('note-storage-api');

export default {
  /**
   * App root folder on Google Drive
   */
  appRootFolder: undefined,
  APP_FOLDER_NAME,

  scanDrive,
  fetchParentNote,
  fetchChildNotes,
  getNoteContent,
  create,
  update,
  remove,
  updateFileName,
  updateNoteContentFileName
};

function setAppRootFolder(appRootFolder) {
  service.appRootFolder = appRootFolder;
  return appRootFolder;
}

function getAppRootFolder() {
  return service.appRootFolder;
}

/**
 * Try to find "APP_FOLDER_NAME" folder on google drive,
 * then read its contents,
 * OR create the "APP_FOLDER_NAME" folder, if it's not found.
 */
function scanDrive() {
  console.debug('Scan note storage...');
  return new Promise(resolve => {
    spinner.show();
    findAppFolder().then(function (searchResult) {
      if (searchResult.length == 0) {
        console.info('App root folder on Google Drive not found, create a new one.');
        createAppRootFolder()
          .then(setAppRootFolder)
          .then(createAppRootTextFile)
          .then(function () {
            resolve(getAppRootFolder());
          });
      } else {
        console.info('App root folder found on Google Drive');
        let appRootFolder = searchResult[0];
        setAppRootFolder(appRootFolder);
        resolve(appRootFolder);
      }
    })
      .finally(function () {
        spinner.hide();
      });
  });
}

/**
 * Find child directories for given noteId folder.
 */
function fetchChildNotes(note) {
  spinner.show();
  return new Promise(resolve => {
    console.debug('[Get] Child notes for: "' + note.name + '"');
    getFiles(note.id).then(function (files) {
      //notes.push(appRootFolder);
      var children = [];
      _.each(files, function (file) {
        if (file.name === note.name + '.txt') {
          return;
        }
        file.isNote = isNote(file);
        children.push(file);
      });
      console.debug('[Loaded] notes for "' + note.id + '"');
      resolve(children);
    })
      .finally(function () {
        spinner.hide();
      });
  });
}

/**
 * Whether a file is a note createad by app,
 * or a user uploaded file (e.g. a "jpeg" image).
 */
function isNote(file) {
  return file.mimeType === 'application/vnd.google-apps.folder';
}

/**
 * Fetch parent folder
 */
function fetchParentNote(noteId) {
  return fetchNoteById(noteId).then(function (parentNote) {
    return parentNote;
  });
}

/**
 * Fetch note folder by id.
 */
function fetchNoteById(noteId) {
  console.debug('[Get] Note folder for: "' + noteId + '"');
  spinner.show();

  let request = googleDriveApi.client.files.get({
    fileId: noteId,
    fields: googleDriveApi.FILE_FIELDS
  });

  let promise = new Promise(resolve => {
    request.execute(function (resp) {
      console.debug('[Loaded] Note folder for: "' + noteId + '"');
      let file = resp;
      file = googleDriveApi.parseParents(file);
      resolve(file);
    });
  })
    .finally(function () {
      spinner.hide();
    });

  return promise;
}

/**
 * Get files from a folder.
 */
function getFiles(folderId) {
  var request = gapi.client.drive.files.list({
    'pageSize': 10,
    'fields': googleDriveApi.FILE_LIST_FIELDS,
    'q': '"' + folderId + '" in parents'
  });

  spinner.show();
  let promise = new Promise(resolve => {
    request.execute(function (resp) {
      console.debug('[Loaded] Files: ', resp);
      if (!resp.files) {
        let errorMessage = 'Remote Storage API: Failed to get files';
        uiErrorNotification.show('Connection with Google Drive failed.\n Can not get files.');
        throw new Error(errorMessage);
      }

      //TODO: same code is duplicated in google-drive-api.js - Refactor!
      resp.files.forEach(googleDriveApi.parseParents);

      spinner.hide();
      resolve(resp.files);
    })
  });

  return promise;
}

/**
 * Create "APP_FOLDER_NAME" directory in the root of google drive.
 */
function createAppRootFolder() {
  console.info('Creating a new App root folder...');
  spinner.show();
  return googleDriveApi.createDirectory({
    name: APP_FOLDER_NAME
  }).then(function (response) {
    if (response.code && response.code === -1) {
      throw new Error('createAppRootFolder error (code = -1)! Response: response');
    }
    console.info('Created App root folder');

    let createdFolder = response;

    return createdFolder;
  })
    .finally(function () {
      spinner.hide();
    });
}

/**
 * Create a text file for the root folder,
 * to store root note's content.
 */
function createAppRootTextFile(appRootFolder) {
  console.info('Creating app root text file...');
  return createFile({
    name: APP_FOLDER_NAME + '.txt',
    content: 'Edit this text...',
    parents: [appRootFolder.id]
  })
    .then(function (response) {
      console.info('Created app root textfile');
      return response;
    })
    .catch(function (error) {
      console.error('Failed to create App Root Text file. Error:', error);
      throw error;
    });
}

/**
 * Try to find "APP_FOLDER_NAME" folder in google drive root.
 */
function findAppFolder() {
  return googleDriveApi.findByName({
    name: APP_FOLDER_NAME,
    folderId: 'root'
  });
}


/**
 * Create a file with text content on google drive.
 *
 * @param {String} options.name - File name.
 * @param {Array} options.parents - Parent directories for the file
 * (goolge drive allows many parents).
 * @param {String} options.content - Text content of the file.
 *
 * src of code:
 * this guy from stackoverflow is a GOD! :)
 * http://stackoverflow.com/a/10323612/1657101
 */
function createFile(options) {
  spinner.show();
  return createEmptyFile({
    name: options.name,
    parents: options.parents
  })
    .then(function (newFile) {
      console.debug('Created a new file: ' + newFile.name);
      return updateFile(newFile, options.content);
    })
    .then(function (updatedFile) {
      console.debug('Updated file: ' + updatedFile.name);
      return updatedFile;
    })
    .finally(function () {
      spinner.hide();
    });

}

/**
 * Create empty file, which may be filled with content later,
 * (in a separate request) to avoid making the multipart request.
 */
function createEmptyFile(options) {
  console.debug('Creating empty file...');
  let request = googleDriveApi.client.files.create({
    name: options.name,
    mimeType: "text/plain",
    parents: options.parents

  });

  spinner.show();
  var promise = new Promise(resolve => {
    request.execute(function (newFile) {
      resolve(newFile);
    });
  })
    .finally(function () {
      spinner.hide();
    });

  return promise;
}

/**
 * Update empty file with text content.
 */
function updateFile(createdFile, content) {
  console.debug('Updating file: ' + createdFile.name);
  spinner.show();
  var request = gapi.client.request({
    path: '/upload/drive/v3/files/' + createdFile.id,
    method: 'PATCH',
    params: {
      uploadType: 'media'
    },
    body: content
  });


  var promise = new Promise(resolve => {
    request.execute(function (resp) {
      resolve(resp);
    });
  })
    .finally(function () {
      spinner.hide();
    });

  return promise;
}

function updateFileName(options) {
  return googleDriveApi.updateFileName(options);
}


function getNoteContent(note) {

  if (!note) {
    throw new Error('noteStorageApi.getNoteContent(): passed note is undefined');
  }
  console.info('[Get] note content for "' + note.name + '"...');
  return findNoteContentFile(note)
    .then(function (noteContentFile) {
      if (!noteContentFile) throw new Error('noteStorageApi.getNoteContent(): noteContentFile is undefined');
      return getTextFileContents({
        fileId: noteContentFile.id
      });
    });
}

function findNoteContentFile(note) {
  return googleDriveApi.findByName({
    name: note.name + '.txt',
    folderId: note.id
  }).then(function (foundFiles) {
    if (!foundFiles) {
      throw new Error('noteStorage.getNoteContent(): no note content file found for note: "' + note.name + '"');
    }

    var noteContentFile = foundFiles[0];
    console.info('[Loaded] Note content file: ' + note.name);

    return noteContentFile;
  });
}

function getTextFileContents(options) {
  var requestParams = {
    fileId: options.fileId,
    alt: 'media'
  };

  var request = gapi.client.request({
    path: '/drive/v3/files/' + requestParams.fileId,
    method: 'GET',
    params: {
      alt: 'media'
    }
  });


  spinner.show();
  var promise = new Promise(resolve => {
    request.execute(function (gapiReturnsFalseHereForBlobs, responsePlain) {
      var responseObject = JSON.parse(responsePlain);
      var responseBody = responseObject.gapiRequest.data.body;
      console.info('[Loaded] Text file contents for a file');

      var fileText = responseBody;

      resolve(fileText);
    });
  })
    .finally(function () {
      spinner.hide();
    });

  return promise;
}

/**
 * Create a note: a directory and a file with note
 * contents inside.
 */
function create(note, parentNote) {
  if (!parentNote) {
    parentNote = getAppRootFolder();
  }

  spinner.show();
  return googleDriveApi.createDirectory({
    name: note.name,
    parents: [parentNote.id]
  }).then(function (createdDirectory) {
    note.id = createdDirectory.id;
    return createFile({
      name: note.name + '.txt',
      content: note.content,
      parents: [createdDirectory.id],
    });
  })
    .then(() => {
      return note;
    })
    .finally(function () {
      spinner.hide();
    });
}

function update(note) {
  console.debug('Updaing note: ' + note);

  var updateSpinner = spinner.create('updating note');
  updateSpinner.show();

  return findNoteContentFile(note)
    .then(function (noteContentFile) {
      return googleDriveApi.updateFile({
        fileId: noteContentFile.id,
        text: note.content
      });
    })
    .then(function (response) {
      if (response.error) {
        console.error('Failed to update file content! Response: ', response);
        throw response;
      }
    })
    .finally(function () {
      updateSpinner.hide();
    });

}

function updateNoteContentFileName(newNote, oldNote) {
  return findNoteContentFile(oldNote)
    .then(function (noteContentFile) {
      return googleDriveApi.updateFileName({
        id: noteContentFile.id,
        name: newNote.name + '.txt'
      });
    });
}

function remove(note) {
  var requestParams = {
    "fileId": note.id,
    "mimeType": "application/vnd.google-apps.folder",
  };

  var request = googleDriveApi.client.files.delete(requestParams);

  spinner.show();
  var promise = new Promise(resolve => {
    request.execute(function (response) {
      if (response.error) {
        console.error('Failed to delete a note "' + note.name + '"');
      }
      console.log('response : ', response);
      resolve(response);
    });

  }).finally(function () {
    spinner.hide();
  });

  return promise;
}
