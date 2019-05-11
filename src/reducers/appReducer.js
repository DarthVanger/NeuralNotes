import { CHANGE_PAGE_ACTION } from 'components/App/AppActions';
import { PAGES_ENUM } from 'components/App/AppConstants';
import { GOOGLE_API_INITITALIZED } from 'components/LoginPage/LoginPagesActions';

const defaultState = {
  page: PAGES_ENUM.LOADING,
  isGoogleApiInitialized: false
};

export const appReducer = (state = defaultState, { type, data }) => {
  switch (type) {
    case CHANGE_PAGE_ACTION:
      return Object.assign({}, state, { page: data });
    case GOOGLE_API_INITITALIZED:
      return Object.assign({}, state, { isGoogleApiInitialized: true });
    default:
      return state;
  }
};
