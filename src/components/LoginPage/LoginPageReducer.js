import auth from 'auth';
import {
  LOAD_GOOGLE_API_SUCCESS_ACTION,
  AUTH_SUCCESS_ACTION,
} from 'components/LoginPage/LoginPageActions';

const defaultState = {
  isGoogleApiInitialized: false,
  isSignedIn: auth.signedIn(),
};

export const loginPageReducer = (state = defaultState, { type }) => {
  switch (type) {
    case LOAD_GOOGLE_API_SUCCESS_ACTION:
      return Object.assign({}, state, { isGoogleApiInitialized: true });
    case AUTH_SUCCESS_ACTION:
      return {
        ...state,
        isSignedIn: true,
      };
    default:
      return state;
  }
};
