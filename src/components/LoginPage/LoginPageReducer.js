import {
  GOOGLE_API_INITIALIZED_ACTION,
  AUTH_SUCCESS_ACTION,
} from 'components/LoginPage/LoginPageActions';

const defaultState = {
  isGoogleApiInitialized: false,
  isSignedIn: false,
};

export const loginPageReducer = (state = defaultState, { type }) => {
  switch (type) {
    case GOOGLE_API_INITIALIZED_ACTION:
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
