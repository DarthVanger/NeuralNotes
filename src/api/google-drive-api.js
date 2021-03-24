/* global gapi */
let client;

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
  getFileById,
  updateFile: updateFile,
  updateFileName: updateFileName,
  createDirectory: createDirectory,
  findFoldersByName,
};

export default self;

/**
 * Load Drive API client library.
 */
function loadDriveApi() {
  console.info('Loading Google Drive API...');
  let promise = new Promise(resolve => {
    gapi.client.load('drive', 'v3').then(
      function() {
        self.client = gapi.client.drive;
        console.info('[Loaded] Google Drive API');
        console.debug(
          'loadDriveApi(): googleDriveApi.client.files: ',
          self.client.files,
        );
        resolve();
      },
      function onError(error) {
        //TODO: show user a notification that drive API failed.
        throw error;
      },
    );
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
    pageSize: 10,
    fields: FILE_LIST_FIELDS,
    q: query,
  };

  request = gapi.client.drive.files.list(params);

  //TODO: allow search inside of a specified folder?
  let promise = new Promise(resolve => {
    request.execute(function(resp) {
      console.debug(
        'googleDriveApi.findByname(): Files found by query "' + query + '": ',
        resp,
      );
      if (resp.error) {
        throw new Error('File named "' + options.name + '" not found');
      }

      resolve(resp.files);
    });
  });

  return promise;
}

function updateFile(options) {
  let request = gapi.client.request({
    path: '/upload/drive/v2/files/' + options.fileId,
    method: 'PUT',
    params: { uploadType: 'media' },
    headers: {
      'Content-Type': 'text/plain',
    },
    body: options.text,
  });

  let promise = new Promise(resolve => {
    request.execute(function(response) {
      resolve(response);
    });
  });

  return promise;
}

function updateFileName({ id, name }) {
  let fileId = id;
  let fileName = name;

  let request = gapi.client.request({
    path: '/drive/v2/files/' + fileId,
    method: 'PATCH',
    body: JSON.stringify({
      title: fileName,
    }),
  });

  console.info('Updating filename to: ' + fileName + '...');
  let promise = new Promise(resolve => {
    request.execute(function(response) {
      console.info('Updated filename to: ' + fileName);
      resolve(response);
    });
  });

  return promise;
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
    name: options.name,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (options.parents) {
    requestParams.parents = options.parents;
  }

  const request = self.client.files.create(requestParams);

  return new Promise(resolve => {
    request.execute(function(newFile) {
      resolve(newFile);
    });
  });
}

function findFoldersByName(name) {
  const query = `name contains '${name}' and trashed = false and mimeType = 'application/vnd.google-apps.folder'`;
  const params = { q: query };
  const request = gapi.client.drive.files.list(params);

  return new Promise(resolve => {
    request.execute(function(resp) {
      resolve(resp.files);
    });
  });
}

function getFileById(fileId) {
  const request = gapi.client.drive.files.get({
    fileId,
    fields: FILE_FIELDS,
  });
  return new Promise(resolve => {
    request.execute(function(resp) {
      resolve(resp);
    });
  });
}
