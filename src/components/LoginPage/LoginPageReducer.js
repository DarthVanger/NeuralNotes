import { GOOGLE_API_INITIALIZED_ACTION } from 'components/LoginPage/LoginPageActions';

const defaultState = {
  isGoogleApiInitialized: false,
};

export const loginPageReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case GOOGLE_API_INITIALIZED_ACTION:
      return Object.assign({}, state, { isGoogleApiInitialized: true });
    default:
      return state;
  }
};
