import auth from 'auth';
import {
  LOAD_GOOGLE_API_SUCCESS_ACTION,
  AUTH_SUCCESS_ACTION,
} from 'components/LoginPage/LoginPageActions';
import { AUTHORIZED_USER_OPENED_APP } from 'components/App/AppActions';

const defaultState = {
  isGoogleApiInitialized: false,
  isSignedIn: auth.signedIn(),
  user: null,
};

export const loginPageReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case LOAD_GOOGLE_API_SUCCESS_ACTION:
      return Object.assign({}, state, { isGoogleApiInitialized: true });
    case AUTH_SUCCESS_ACTION:
      return {
        ...state,
        isSignedIn: true,
        user: data,
      };

    case AUTHORIZED_USER_OPENED_APP:
      return {
        ...state,
        isSignedIn: true,
        user: data,
      };

    default:
      return state;
  }
};
