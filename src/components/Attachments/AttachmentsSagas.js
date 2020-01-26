import { eventChannel, END } from 'redux-saga';
import { all, put, call, fork, take, takeEvery } from 'redux-saga/effects';
import { ResumableUploadToGoogleDrive } from 'libs/google-drive-uploader';
import auth from 'auth';
import * as Actions from './AttachmentsActions';

const createUploaderCallback = emitter => (result, error) => {
  if (error) {
    emitter({
      type: 'error',
      error,
    });
    emitter(END);
    return;
  }

  const handlersMap = {
    initialize: () => emitter({ type: 'initialized' }),
    getLocation: () => emitter({ type: 'getLocation' }),
    start: () => emitter({ type: 'started' }),
    Uploading: () =>
      emitter({
        type: 'uploading',
        progress: result.progressNumber.current / result.progressNumber.end,
      }),
    Done: () => {
      emitter({
        type: 'done',
        result: result.result,
      });
      emitter(END);
    },
  };
  const handleResult = handlersMap[result.status];

  if (!handleResult) {
    // @note: we don't need really handle this exception
    throw new Error('Unable to handle this case');
  }

  handleResult();
};

function createUploadFileChannel(file) {
  return eventChannel(emitter => {
    const fileReader = new FileReader();
    fileReader.fileName = file.name;
    fileReader.fileSize = file.size;
    fileReader.fileType = file.type;
    fileReader.onload = startUploading;
    fileReader.readAsArrayBuffer(file);

    function startUploading(e) {
      const f = e.target;
      const resource = {
        fileName: f.fileName,
        fileSize: f.fileSize,
        fileType: f.fileType,
        fileBuffer: f.result,
        accessToken: auth.getToken(),
      };
      const ru = new ResumableUploadToGoogleDrive();

      ru.Do(resource, createUploaderCallback(emitter));
    }

    return () => {
      // @todo: handle channel closing
    };
  });
}

function mapChannelEventToAction(event, file) {
  const mapEventToAction = {
    initialized: () => Actions.fileUploadInitialized(file),
    getLocation: () => Actions.fileUploadGetLocation(file),
    started: () => Actions.fileUploadingStarted(file),
    uploading: () => Actions.fileUploadingProgressUpdated(file, event.progress),
    done: () => Actions.fileUploadingSuccess(file, event.result),
    error: () => Actions.fileUploadingFailure(file, event.error),
  };

  return mapEventToAction[event.type]();
}

function* uploadFile(file) {
  const channel = yield call(createUploadFileChannel, file);

  try {
    while (true) {
      const event = yield take(channel);

      yield put(mapChannelEventToAction(event, file));
    }
  } catch (error) {
    console.log('atata error', error);
  } finally {
    console.log('channel closed');
    // do nothing
  }
}

function* addUploadingFilesSaga(action) {
  const { files } = action.payload;

  const file = files[0];

  if (!file) {
    return;
  }

  yield fork(uploadFile, file);
}

export function* attachmentsInit() {
  yield all([takeEvery(Actions.addUploadingFiles, addUploadingFilesSaga)]);
}
