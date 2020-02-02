import { eventChannel, END } from 'redux-saga';
import {
  all,
  put,
  call,
  fork,
  take,
  select,
  takeEvery,
} from 'redux-saga/effects';
import throttle from 'lodash/throttle';
// import { ResumableUploadToGoogleDrive } from 'libs/google-drive-uploader';
import auth from 'auth';
import { UploadsActions } from './UploadsActions';

const ENDPOINT =
  'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';
const SESSION_TOKEN = 'upload_id=';
const PROGRESS_UPDATE_INTERVAL = 1000;
const {
  sessionRetrieved,
  progressUpdated,
  uploadSuccess,
  uploadFailure,
} = UploadsActions.file;

function* fetchUploadFileSessionSaga(file) {
  const response = yield call(() =>
    fetch(ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        mimeType: file.type,
        name: file.name,
        parents: [file.uploadFolderId],
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getToken()}`,
      },
    }),
  );

  if (response.status !== 200) {
    const error = new Error('Fetch session error');
    error.code = 'FETCH_SESSION_ERROR';
    throw error;
  }

  const location = response.headers.get('location');

  return location.slice(
    location.lastIndexOf(SESSION_TOKEN) + SESSION_TOKEN.length,
  );
}

function createFileUploadingChannel(file, session) {
  return eventChannel(emitter => {
    function onProgress(event) {
      emitter({
        type: progressUpdated,
        progress: {
          loaded: event.loaded,
          total: event.total,
        },
      });
    }

    function onSuccess(event) {
      // check response for failure
      emitter({
        type: uploadSuccess,
        result: JSON.parse(event.target.responseText),
      });
      emitter(END);
    }

    function onFailure() {
      const error = new Error('Network error');
      error.code = 'NETWORK_ERROR';

      emitter({
        type: uploadFailure,
        error,
      });
      emitter(END);
    }

    const xhr = new XMLHttpRequest();

    xhr.open('PUT', `${ENDPOINT}&${SESSION_TOKEN}${session}`);
    xhr.setRequestHeader('Authorization', `Bearer ${auth.getToken()}`);
    xhr.upload.onprogress = throttle(onProgress, PROGRESS_UPDATE_INTERVAL);
    xhr.onload = onSuccess;
    xhr.onerror = onFailure;
    // @todo: add upload position
    xhr.send(file);

    return () => xhr.abort();
  });
}

function* startFileUploadingSaga(file) {
  const { session } = yield select(state =>
    state.uploads.list.find(item => item.file === file),
  );

  const fileUploadingChannel = yield call(
    createFileUploadingChannel,
    file,
    session,
  );

  while (true) {
    const event = yield take(fileUploadingChannel);

    switch (event.type) {
      case progressUpdated:
        yield put(progressUpdated(file, event.progress));
        break;
      case uploadSuccess:
        yield put(uploadSuccess(file, event.result));
        break;
      case uploadFailure:
        yield put(uploadFailure(file, event.error));
        break;
    }
  }
}

function* uploadFileSaga(file) {
  const state = yield select(state =>
    state.uploads.list.find(item => item.file === file),
  );

  if (!state.session) {
    const session = yield call(fetchUploadFileSessionSaga, file);

    yield put(sessionRetrieved(file, session));
  }

  yield call(startFileUploadingSaga, file);
}

function* addedFilesSaga(action) {
  const { files } = action.payload;

  yield all(files.map(file => call(uploadFileSaga, file)));
}

export function* uploadsInit() {
  yield all([takeEvery(UploadsActions.list.addedFiles, addedFilesSaga)]);
}
