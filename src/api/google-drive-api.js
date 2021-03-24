/* global gapi */
let client;

/*
 * Fields to get from Google Drive when requesting a file.
 */
const FILE_FIELDS = 'id, name, mimeType, parents';
/*
 * Fields to get from Google Drive when requestin a list of files.
 */
const FILE_LIST_FIELDS = 'nextPageToken, files(' + FILE_FIELDS + ')';

const self = {
  FILE_FIELDS: FILE_FIELDS,
  FILE_LIST_FIELDS: FILE_LIST_FIELDS,
  loadDriveApi: loadDriveApi,
  client: client,
  getFileById,
  findFileByName,
  updateFileName,
  createFolder,
  findFoldersByName,
  getFolderChildren,
  createTextFile,
  updateTextFileContent,
};

export default self;

/**
 * Load Drive API client library.
 */
function loadDriveApi() {
  console.info('Loading Google Drive API...');
  const promise = new Promise(resolve => {
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
function findFileByName(options) {
  let query;

  if (options.name) {
    query = 'name = "' + options.name + '"';
  } else {
    throw new Error('googleDriveApi.findFileByName: no filename passed!');
  }

  if (options.folderId) {
    query += ' and "' + options.folderId + '" in parents';
  }

  query += ' and trashed = false';

  const params = {
    pageSize: 10,
    fields: FILE_LIST_FIELDS,
    q: query,
  };

  const request = gapi.client.drive.files.list(params);

  const promise = new Promise(resolve => {
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

function updateTextFileContent({ fileId, text }) {
  const request = gapi.client.request({
    path: '/upload/drive/v3/files/' + fileId,
    method: 'PATCH',
    params: { uploadType: 'media' },
    headers: {
      'Content-Type': 'text/plain',
    },
    body: text,
  });

  const promise = new Promise(resolve => {
    request.execute(function(response) {
      resolve(response);
    });
  });

  return promise;
}

function updateFileName({ id, name }) {
  const fileId = id;
  const fileName = name;

  const request = gapi.client.request({
    path: '/drive/v2/files/' + fileId,
    method: 'PATCH',
    body: JSON.stringify({
      title: fileName,
    }),
  });

  console.info('Updating filename to: ' + fileName + '...');
  const promise = new Promise(resolve => {
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
function createFolder(options) {
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

function getFolderChildren(folderId) {
  const request = gapi.client.drive.files.list({
    pageSize: 10,
    fields: FILE_LIST_FIELDS,
    q: 'trashed = false and "' + folderId + '" in parents',
  });

  return new Promise((resolve, reject) => {
    request.execute(function(resp) {
      if (!resp.files) {
        reject();
        throw new Error('Remote Storage API: Failed to get files');
      }

      resolve(resp.files);
    });
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
function createTextFile({ name, parents, content }) {
  return createEmptyTextFile({
    name,
    parents,
  }).then(function(newFile) {
    return updateTextFileContent({ fileId: newFile.id, text: content });
  });
}

function createEmptyTextFile({ parents, name }) {
  console.debug('Creating empty file...');
  let request = gapi.client.drive.files.create({
    mimeType: 'text/plain',
    name,
    parents,
  });

  return new Promise(resolve => {
    request.execute(function(newFile) {
      resolve(newFile);
    });
  });
}
