import { connect } from 'react-redux';
import { action } from 'sagas';

import { LogoutButtonComponent } from 'components/LogoutButton/LogoutButtonComponent';
import { LOGOUT_ACTION } from 'components/LogoutButton/LogoutButtonAction';

const mapDispatchToProps = () => ({
  logout: () => action(LOGOUT_ACTION),
});

export const LogoutButtonContainer = connect(
  null,
  mapDispatchToProps,
)(LogoutButtonComponent);
