import { connect } from 'react-redux';
import { action } from 'sagas';

import { LOGOUT_ACTION } from 'components/LogoutMenuItem/LogoutMenuItemAction';
import { LogoutMenuItemComponent } from 'components/LogoutMenuItem/LogoutMenuItemComponent';

const mapDispatchToProps = () => ({
  logout: () => action(LOGOUT_ACTION),
});

export const LogoutMenuItemContainer = connect(
  null,
  mapDispatchToProps,
)(LogoutMenuItemComponent);
