import { connect } from 'react-redux';
import { action } from 'sagas';

import { NotesPageComponent } from 'components/NotesPage/NotesPageComponent';
import {
  CHANGE_USER_HELP_SEEN_ACTION,
  CHANGE_SELECTED_NOTE_ACTION,
  REQUEST_NOTE_TEXT_ACTION
} from 'components/NotesPage/NotesPageActions';

const mapStateToProps = ({ notes: { selectedNote, isHelpViewed } }) => {
  return {
    selectedNote,
    isHelpViewed
  }
};

const mapDispatchToProps = () => ({
  closeHelp: () => action(CHANGE_USER_HELP_SEEN_ACTION, true),
  requestNoteText: data => action(REQUEST_NOTE_TEXT_ACTION, data),
  changeSelectedNote: data => action(CHANGE_SELECTED_NOTE_ACTION, data),
});

export const NotesPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotesPageComponent);
