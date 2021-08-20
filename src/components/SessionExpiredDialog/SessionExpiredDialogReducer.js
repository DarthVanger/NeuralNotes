import React from 'react';

const defaultState = {
  sessionExpired: false,
};

import {
  ATTEMPT_TO_CALL_API_WITH_EXPIRED_TOKEN_ACTION,
  SESSION_REFRESH_SUCCESS_ACTION,
} from 'api/apiActions';

export const sessionExpiredDialogReducer = (
  state = defaultState,
  { type, data },
) => {
  switch (type) {
    case ATTEMPT_TO_CALL_API_WITH_EXPIRED_TOKEN_ACTION:
      return {
        ...state,
        sessionExpired: true,
      };
    case SESSION_REFRESH_SUCCESS_ACTION:
      return {
        ...state,
        sessionExpired: false,
      };
    default:
      return state;
  }
};
