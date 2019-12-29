/* global gapi */
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar'

let client;

let spinner = siteGlobalLoadingBar.create('google-drive-api');

/*
 * Fields to get from Google Drive when requesting a file.
 */
let FILE_FIELDS = 'id, name, mimeType, parents';
/*
 * Fields to get from Google Drive when requestin a list of files.
 */
let FILE_LIST_FIELDS = 'nextPageToken, files(' + FILE_FIELDS + ')';

var self = {
  FILE_FIELDS: FILE_FIELDS,
  FILE_LIST_FIELDS: FILE_LIST_FIELDS,
  loadDriveApi: loadDriveApi,
  client: client,
  findByName,
  findNotesByName,
  updateFile: updateFile,
  updateFileName: updateFileName,
  parseParents: parseParents,
  createDirectory: createDirectory
};

export default self;

/**
 * Load Drive API client library.
 */
function loadDriveApi() {
  console.info('Loading Google Drive API...');
  let promise = new Promise(resolve => {
    gapi.client.load('drive', 'v3').then(function () {
      self.client = gapi.client.drive;
      console.info('[Loaded] Google Drive API');
      console.debug('loadDriveApi(): googleDriveApi.client.files: ', self.client.files);
      resolve();
    }, function onError(error) {
      //TODO: show user a notification that drive API failed.
      throw error;
    });
  });

  return promise;
}

/**
 * Find a file on google drive by name.
 */
function findByName(options) {
  let query;

  if (options.name) {
    query = 'name = "' + options.name + '"';
  } else {
    throw new Error('googleDriveApi.findByName: no filename passed!');
  }

  let request;

  if (options.folderId) {
    query += ' and "' + options.folderId + '" in parents';
  }

  query += ' and trashed = false';

  let params = {
    'pageSize': 10,
    'fields': FILE_LIST_FIELDS,
    'q': query
  };

  request = gapi.client.drive.files.list(params);

  //TODO: allow search inside of a specified folder?
  spinner.show();
  let promise = new Promise(resolve => {
    request.execute(function (resp) {
      console.debug('googleDriveApi.findByname(): Files found by query "' + query + '": ', resp);
      if (resp.error) {
        throw new Error('File named "' + options.name + '" not found');
      }
      //TODO: same code is duplicated in note-storage.js - Refactor!
      resp.files.forEach(parseParents);

      resolve(resp.files);
      spinner.hide();
    });
  });

  return promise;
}

function updateFile(options) {
  let request = gapi.client.request({
    'path': '/upload/drive/v2/files/' + options.fileId,
    'method': 'PUT',
    'params': { 'uploadType': 'media' },
    'headers': {
      'Content-Type': 'text/plain'
    },
    'body': options.text
  });

  let promise = new Promise(resolve => {
    request.execute(function (response) {
      resolve(response);
    });
  });

  return promise;
}

function updateFileName({ id, name }) {
  let fileId = id;
  let fileName = name;

  let request = gapi.client.request({
    'path': '/drive/v2/files/' + fileId,
    'method': 'PATCH',
    'body': JSON.stringify({
      title: fileName
    })
  });

  console.info('Updating filename to: ' + fileName + '...');
  let promise = new Promise(resolve => {
    request.execute(function (response) {
      console.info('Updated filename to: ' + fileName);
      resolve(response);
    });
  });

  return promise;
}

/**
 * We don't want file to have multiple parents
 * (but google drive allows that).
 * So copy parents[0] to parent.
 */
function parseParents(file) {
  if (file.parents) {
    if (file.parents && file.parents.length > 1) {
      throw new Error('Files shouldn\'t have more than one parent. File with more than one parent: ', file);
    }
    file.parent = { id: file.parents[0] };
  } else {
    console.debug('googleDriveApi.parseParents(): skipping file with name "' + file.name + '", because it has no "parents" property');
  }
}

/**
 * Create a directory.
 *
 * @param {String} options.name - Directory name.
 * @param {Array} options.parents - Parent directories for the created
 * directory (goolge drive allows many parents).
 */
function createDirectory(options) {
  var requestParams = {
    "name": options.name,
    "mimeType": "application/vnd.google-apps.folder",
  };

  if (options.parents) {
    requestParams.parents = options.parents;
  }

  const request = self.client.files.create(requestParams);

  spinner.show();
  return new Promise(resolve => {
    request.execute(function (newFile) {
      resolve(newFile);
    });
  }).finally(function () {
    spinner.hide();
  });
}

function findNotesByName(name = '') {
  const query = `name contains '${name}' and trashed = false and mimeType = 'text/plain'`;
  const params = { 'q': query };
  const request = gapi.client.drive.files.list(params);

  spinner.show();

  return new Promise(resolve => {
    request.execute(function (resp) {
      resolve(resp.files);
      spinner.hide();
    });
  });
}
