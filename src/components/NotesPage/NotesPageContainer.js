import { connect } from 'react-redux';
import { action } from 'sagas';

import { CHANGE_USER_HELP_SEEN_ACTION } from 'components/NotesPage/NotesPageActions';
import { NotesPageComponent } from 'components/NotesPage/NotesPageComponent';

const mapStateToProps = ({ notes: { isHelpViewed } }) => {
  return {
    isHelpViewed,
  };
};

const mapDispatchToProps = () => ({
  closeHelp: () => action(CHANGE_USER_HELP_SEEN_ACTION, true),
});

export const NotesPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotesPageComponent);
