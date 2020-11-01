import auth from 'auth';
import throttle from 'lodash/throttle';
import { eventChannel, END } from 'redux-saga';
import { all, put, call, take, select, takeEvery } from 'redux-saga/effects';

import { UploadsActions } from './UploadsActions';
import { UPLOADS_REDUCER_KEY } from './UploadsConstants';

const ENDPOINT =
  'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';
const SESSION_PARAM = 'upload_id=';
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
      signal: file.abortController.signal,
    }),
  );

  if (response.status !== 200) {
    const error = new Error('Fetch session error');
    error.code = 'FETCH_SESSION_ERROR';
    throw error;
  }

  const location = response.headers.get('location');

  return location.slice(
    location.lastIndexOf(SESSION_PARAM) + SESSION_PARAM.length,
  );
}

function createFileUploadingChannel(file, session) {
  return eventChannel(emitter => {
    function onProgress(event) {
      const uploadedLength = file.uploadedLength || 0;
      const loaded = uploadedLength + event.loaded;
      const total = uploadedLength + event.total;

      emitter({
        type: progressUpdated,
        progress: {
          percent: Math.trunc((100 * loaded) / total),
          loaded,
          total,
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

    xhr.open('PUT', `${ENDPOINT}&${SESSION_PARAM}${session}`);
    xhr.setRequestHeader('Authorization', `Bearer ${auth.getToken()}`);

    if (file.uploadedLength) {
      // if resume upload
      xhr.setRequestHeader(
        'Content-Range',
        `bytes ${file.uploadedLength + 1}-${file.size - 1}/${file.size}`,
      );
    }

    xhr.upload.onprogress = throttle(onProgress, PROGRESS_UPDATE_INTERVAL);
    xhr.onload = onSuccess;
    xhr.onerror = onFailure;

    file.abortController.signal.addEventListener('abort', () => {
      xhr.abort();
      const error = new Error('User cancelled');
      error.code = 'USER_CANCELLED';
      emitter({
        type: uploadFailure,
        error,
      });
      emitter(END);
    });

    xhr.send(file.uploadedLength ? file.slice(file.uploadedLength + 1) : file);

    // event channel should return function
    return () => {};
  });
}

function* startFileUploadingSaga(file) {
  const { session } = yield select(state =>
    state[UPLOADS_REDUCER_KEY].list.find(item => item.file === file),
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
    state[UPLOADS_REDUCER_KEY].list.find(item => item.file === file),
  );

  try {
    if (!state.session) {
      const session = yield call(fetchUploadFileSessionSaga, file);

      yield put(sessionRetrieved(file, session));
    }

    yield call(startFileUploadingSaga, file);
  } catch (error) {
    yield put(uploadFailure(file, error));
  }
}

function* addedFilesSaga(action) {
  const { files } = action.payload;

  yield all(files.map(file => call(uploadFileSaga, file)));
}

function* cancelUploadSaga(action) {
  const { file } = action.payload;

  yield call(() => file.abortController.abort());
}

function* checkFileUploadedRange(file) {
  const { session } = yield select(state =>
    state[UPLOADS_REDUCER_KEY].list.find(item => item.file === file),
  );
  const response = yield call(() =>
    fetch(`${ENDPOINT}&${SESSION_PARAM}${session}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.getToken()}`,
        'Content-Range': `bytes */${file.size}`,
      },
    }),
  );
  return response.headers.get('Range').split('-')[1];
}

function* retryUploadSaga(action) {
  const { file } = action.payload;
  try {
    file.abortController = new window.AbortController();
    file.uploadedLength = parseInt(
      yield call(checkFileUploadedRange, file),
      10,
    );

    yield call(startFileUploadingSaga, file);
  } catch (error) {
    yield put(uploadFailure(file, error));
  }
}

export function* uploadsInit() {
  yield all([
    takeEvery(UploadsActions.list.addedFiles, addedFilesSaga),
    takeEvery(UploadsActions.file.cancelUpload, cancelUploadSaga),
    takeEvery(UploadsActions.file.retryUpload, retryUploadSaga),
  ]);
}
