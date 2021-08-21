import { all } from 'redux-saga/effects';

import { appInit } from 'components/App/AppSagas';
import { loginInit } from 'components/LoginPage/LoginPageSagas';
import { logoutInit } from 'components/NotesPage/NotesPageTopBar/NotesPageTopBarSagas';
import { noteDetailsInit } from 'components/NoteDetails/NoteDetailsSagas';
import { noteMindMapInit } from 'components/NotesMindMap/NotesMindMapSagas';
import { searchPageInit } from 'components/SearchPage/SearchPageSagas';
import { spinnerInit } from 'components/Spinner/SpinnerSagas';
import { uploadsInit } from 'components/Uploads/UploadsSagas';
import { bottomBarInit } from 'components/BottomBar/BottomBarSagas';
import { notesPageInit } from 'components/NotesPage/NotesPageSagas';
import { sessionExpiredDialogInit } from 'components/SessionExpiredDialog/SessionExpiredDialogSagas';

export function* rootSaga() {
  yield all([
    appInit(),
    spinnerInit(),
    loginInit(),
    logoutInit(),
    noteMindMapInit(),
    uploadsInit(),
    noteDetailsInit(),
    searchPageInit(),
    bottomBarInit(),
    notesPageInit(),
    sessionExpiredDialogInit(),
  ]);
}
