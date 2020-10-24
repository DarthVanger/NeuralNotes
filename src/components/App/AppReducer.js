// import { CHANGE_PAGE_ACTION } from 'components/App/AppActions';
// import { PAGES_ENUM } from 'components/App/AppConstants';
import { GOOGLE_API_INITIALIZED_ACTION } from 'components/LoginPage/LoginPagesActions';

const defaultState = {};

export const appReducer = (state = defaultState, { type }) => {
  switch (type) {
    // case CHANGE_PAGE_ACTION:
    //   return Object.assign({}, state, { page: data });
    case GOOGLE_API_INITIALIZED_ACTION:
      return Object.assign({}, state, { isGoogleApiInitialized: true });
    default:
      return state;
  }
};
