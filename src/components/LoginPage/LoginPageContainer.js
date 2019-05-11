import { connect } from 'react-redux';
import { REQUEST_AUTHORIZATION } from 'components/LoginPage/LoginPagesActions';
import { LoginPageComponent } from 'components/LoginPage/LoginPageComponent';
import { action } from 'sagas';

const mapStateToProps = ({ appReducer: { isGoogleApiInitialized } }) => ({
  isGoogleApiInitialized
});

const mapDispatchToProps = () => ({
  requestAuthorization() {
    action(REQUEST_AUTHORIZATION);
  }
});

export const LoginPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginPageComponent);
