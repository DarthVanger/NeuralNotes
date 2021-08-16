import { connect } from 'react-redux';
import { makeAction } from 'redux-store';

import { REQUEST_AUTHORIZATION_ACTION } from 'components/LoginPage/LoginPageActions';
import { LoginPageComponent } from 'components/LoginPage/LoginPageComponent';

const mapStateToProps = ({ login: { isGoogleApiInitialized } }) => ({
  isGoogleApiInitialized,
});

const mapDispatchToProps = () => ({
  requestAuthorization() {
    makeAction(REQUEST_AUTHORIZATION_ACTION);
  },
});

export const LoginPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginPageComponent);
