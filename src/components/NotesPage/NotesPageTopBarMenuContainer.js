import { connect } from 'react-redux';
import { action } from 'sagas';

import { LOGOUT_ACTION } from 'components/NotesPage/NotesPageTopBarMenuAction';
import { NotesPageTopBarMenu } from 'components/NotesPage/NotesPageTopBarMenu';

const mapDispatchToProps = () => ({
  logout: () => action(LOGOUT_ACTION),
});

export const NotesPageTopBarMenuContainer = connect(
  null,
  mapDispatchToProps,
)(NotesPageTopBarMenu);
