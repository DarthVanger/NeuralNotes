import { connect } from 'react-redux';
import { action } from 'sagas';

import { LOGOUT_ACTION } from 'components/LogoutButton/LogoutButtonAction';
import { LogoutButtonComponent } from 'components/LogoutButton/LogoutButtonComponent';

const mapDispatchToProps = () => ({
  logout: () => action(LOGOUT_ACTION),
});

export const LogoutButtonContainer = connect(
  null,
  mapDispatchToProps,
)(LogoutButtonComponent);
