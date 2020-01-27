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

function createUploadFileChannel(file, uploadFolderId) {
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
        folderId: uploadFolderId,
      };
      const ru = new ResumableUploadToGoogleDrive();

      ru.Do(resource, createUploaderCallback(emitter));
    }

    return () => {
      // @todo: handle channel closing
    };
  });
}

function mapChannelEventToAction(event, file, uploadFolderId) {
  const mapEventToAction = {
    initialized: () => Actions.fileUploadInitialized(file, uploadFolderId),
    getLocation: () => Actions.fileUploadGetLocation(file, uploadFolderId),
    started: () => Actions.fileUploadingStarted(file, uploadFolderId),
    uploading: () =>
      Actions.fileUploadingProgressUpdated(
        file,
        uploadFolderId,
        event.progress,
      ),
    done: () =>
      Actions.fileUploadingSuccess(file, uploadFolderId, event.result),
    error: () =>
      Actions.fileUploadingFailure(file, uploadFolderId, event.error),
  };

  return mapEventToAction[event.type]();
}

function* uploadFile(file, uploadFolderId) {
  const channel = yield call(createUploadFileChannel, file, uploadFolderId);

  try {
    while (true) {
      const event = yield take(channel);

      yield put(mapChannelEventToAction(event, file, uploadFolderId));
    }
  } catch (error) {
    console.log('atata error', error);
  } finally {
    console.log('channel closed');
    // do nothing
  }
}

function* addUploadingFilesSaga(action) {
  const { files, uploadFolderId } = action.payload;

  yield all(files.map(item => fork(uploadFile, item, uploadFolderId)));
}

export function* attachmentsInit() {
  yield all([takeEvery(Actions.addUploadingFiles, addUploadingFilesSaga)]);
}