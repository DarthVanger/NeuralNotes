/* global gapi */
import googleDriveApi from 'api/google-drive-api';

const APP_FOLDER_NAME = 'NeuralNotes';

let appRootFolder;

export default {
  /**
   * App root folder on Google Drive
   */
  APP_FOLDER_NAME,

  scanDrive,
  fetchParentNote,
  fetchChildNotes,
  getNoteContent,
  create,
  updateNoteContent,
  remove,
  move,
  updateFileName,
  updateNoteContentFileName,
  getNoteById,
  updateNoteName,
  getLinkToNote,
  isUploadedFile,
  isAppFolder,
  findNotesByName,
};

/**
 * We don't want file to have multiple parents
 * (but google drive allows that).
 * So copy parents[0] to parent.
 */
function parseParents(file) {
  if (file.parents) {
    if (file.parents && file.parents.length > 1) {
      throw new Error(
        "Files shouldn't have more than one parent. File with more than one parent: ",
        file,
      );
    }
    file.parent = { id: file.parents[0] };
  } else {
    console.debug(
      'googleDriveApi.parseParents(): skipping file with name "' +
        file.name +
        '", because it has no "parents" property',
    );
  }

  return file;
}

function setAppRootFolder(folder) {
  appRootFolder = folder;
  return appRootFolder;
}

/**
 * Try to find "APP_FOLDER_NAME" folder on google drive,
 * then read its contents,
 * OR create the "APP_FOLDER_NAME" folder, if it's not found.
 */
function scanDrive() {
  console.debug('Scan note storage...');
  return new Promise(resolve => {
    findAppFolder().then(function(searchResult) {
      if (searchResult.length === 0) {
        console.info(
          'App root folder on Google Drive not found, create a new one.',
        );
        createAppRootFolder()
          .then(setAppRootFolder)
          .then(createAppRootTextFile)
          .then(() => resolve(appRootFolder));
      } else {
        console.info('App root folder found on Google Drive');
        let searchedAppRootFolder = searchResult[0];
        setAppRootFolder(searchedAppRootFolder);
        resolve(searchedAppRootFolder);
      }
    });
  });
}

/**
 * Find child directories for given noteId folder.
 */
function fetchChildNotes(note) {
  console.debug('[Get] Child notes for: "' + note.name + '"');
  return googleDriveApi.getFolderChildren(note.id).then(function(files) {
    const children = [];
    files &&
      files.forEach(function(file) {
        if (file.name === note.name + '.txt') {
          return;
        }
        children.push(parseParents(file));
      });
    console.debug('[Loaded] notes for "' + note.id + '":', children);
    return children;
  });
}

/**
 * Fetch parent folder
 */
function fetchParentNote(note) {
  console.debug(`fetchParentNote for: `, note);
  return fetchNoteById(note.parent.id).then(function(parentNote) {
    return parentNote;
  });
}

/**
 * Fetch note folder by id.
 */
function fetchNoteById(noteId) {
  console.debug('[Get] Note folder for: "' + noteId + '"');

  return googleDriveApi.getFileById(noteId).then(resp => {
    console.debug('[Loaded] Note folder for: "' + noteId + '"');
    const file = resp;
    return parseParents(file);
  });
}

/**
 * Create "APP_FOLDER_NAME" directory in the root of google drive.
 */
function createAppRootFolder() {
  console.info('Creating a new App root folder...');
  return googleDriveApi
    .createFolder({
      name: APP_FOLDER_NAME,
    })
    .then(function(response) {
      if (response.code && response.code === -1) {
        throw new Error(
          'createAppRootFolder error (code = -1)! Response: response',
        );
      }
      console.info('Created App root folder');

      return response;
    });
}

/**
 * Create a text file for the root folder,
 * to store root note's content.
 */
function createAppRootTextFile({ id }) {
  console.info('Creating app root text file...');
  return googleDriveApi
    .createTextFile({
      name: APP_FOLDER_NAME + '.txt',
      content: 'Edit this text...',
      parents: [id],
    })
    .then(function(response) {
      console.info('Created app root textfile');
      return response;
    })
    .catch(function(error) {
      console.error('Failed to create App Root Text file. Error:', error);
      throw error;
    });
}

/**
 * Try to find "APP_FOLDER_NAME" folder in google drive root.
 */
function findAppFolder() {
  return googleDriveApi.findFileByName({
    name: APP_FOLDER_NAME,
    folderId: 'root',
  });
}

function updateFileName(options) {
  return googleDriveApi.updateFileName(options);
}

function getNoteContent(note) {
  if (!note) {
    throw new Error(
      'noteStorageApi.getNoteContent(): passed note is undefined',
    );
  }
  console.info('[Get] note content for "' + note.name + '"...');
  return findNoteContentFile(note).then(function(noteContentFile) {
    if (!noteContentFile)
      throw new Error(
        'noteStorageApi.getNoteContent(): noteContentFile is undefined',
      );
    return getTextFileContents({
      fileId: noteContentFile.id,
    });
  });
}

function findNoteContentFile(note) {
  return googleDriveApi
    .findFileByName({
      name: note.name + '.txt',
      folderId: note.id,
    })
    .then(function(foundFiles) {
      if (!foundFiles) {
        throw new Error(
          'noteStorage.getNoteContent(): no note content file found for note: "' +
            note.name +
            '"',
        );
      }

      const noteContentFile = foundFiles[0];
      return parseParents(noteContentFile);
    });
}

function getTextFileContents(options) {
  const requestParams = {
    fileId: options.fileId,
    alt: 'media',
  };

  const request = gapi.client.request({
    path: '/drive/v3/files/' + requestParams.fileId,
    method: 'GET',
    params: {
      alt: 'media',
    },
  });

  return new Promise(resolve => {
    request.execute(function(gapiReturnsFalseHereForBlobs, responsePlain) {
      const responseObject = JSON.parse(responsePlain);
      const responseBody = responseObject.gapiRequest.data.body;
      console.info('[Loaded] Text file contents for a file');

      resolve(responseBody);
    });
  });
}

/**
 * Create a note: a directory and a file with note
 * contents inside.
 */
function create(note) {
  console.debug('creating a new note: ', note, 'with parent: ', note.parent);
  if (!note.parent) {
    console.debug(
      'note.parent is undefined, so creating note in the app root folder!',
    );
    note.parent = appRootFolder;
  }

  return googleDriveApi
    .createFolder({
      name: note.name,
      parents: [note.parent.id],
    })
    .then(function(createdDirectory) {
      note.id = createdDirectory.id;
      return googleDriveApi.createTextFile({
        name: note.name + '.txt',
        content: note.content,
        parents: [createdDirectory.id],
      });
    })
    .then(() => {
      console.debug('New note created!', note);
      return note;
    });
}

function updateNoteContent(note) {
  console.debug('Updaing note content for: ', note);

  return findNoteContentFile(note)
    .then(function(noteContentFile) {
      return googleDriveApi.updateTextFileContent({
        fileId: noteContentFile.id,
        text: note.content,
      });
    })
    .then(function(response) {
      if (response.error) {
        console.error('Failed to update file content! Response: ', response);
        throw response;
      }
    });
}

function updateNoteContentFileName({ note, newName }) {
  return findNoteContentFile(note)
    .then(function(noteContentFile) {
      return googleDriveApi.updateFileName({
        id: noteContentFile.id,
        name: newName + '.txt',
      });
    })
    .catch(error => {
      console.error(
        'noteStorageApi.updateNoteContentFileName(): could not find note content file for note "' +
          note.name +
          '"',
      );
      throw error;
    });
}

function remove(note) {
  const requestParams = {
    fileId: note.id,
    mimeType: 'application/vnd.google-apps.folder',
    trashed: true,
  };

  const request = googleDriveApi.client.files.update(requestParams);

  return new Promise(resolve => {
    request.execute(function(response) {
      if (response.error) {
        console.error('Failed to delete a note "' + note.name + '"');
      }
      resolve(response);
    });
  });
}

function move({ noteId, newParentId }) {
  const request = gapi.client.request({
    path: '/drive/v2/files/' + noteId,
    method: 'PUT',
    params: { uploadType: 'multipart', alt: 'json' },
    body: { parents: [{ id: newParentId }] },
  });

  return new Promise((resolve, reject) => {
    request.execute(function(response, responseRaw) {
      if (response) {
        resolve(response);
      } else {
        reject(responseRaw);
      }
    });
  }).catch(e => {
    throw new Error(e);
  });
}

function getNoteById(noteId) {
  return googleDriveApi.getFileById(noteId).then(file => parseParents(file));
}

function updateNoteName({ note, newName }) {
  return getNoteById(note.id).then(noteInStorage => {
    return Promise.all([
      updateFileName({ id: note.id, name: newName }),
      updateNoteContentFileName({
        note: noteInStorage,
        newName,
      }),
    ]).then(function(responses) {
      console.debug('responses for note name update: ', responses);
      const newNote = { ...note };
      newNote.name = newName;
      return newNote;
    });
  });
}

function getLinkToNote({ id }) {
  return 'https://drive.google.com/open?id=' + id;
}

function isUploadedFile(file) {
  return file.mimeType !== 'application/vnd.google-apps.folder';
}

function isAppFolder(note) {
  return note.name === APP_FOLDER_NAME;
}

function findNotesByName(name) {
  return googleDriveApi.findFoldersByName(name);
}
