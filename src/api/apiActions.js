export const ATTEMPT_TO_CALL_API_WITH_EXPIRED_TOKEN_ACTION =
  'ATTEMPT_TO_CALL_API_WITH_EXPIRED_TOKEN_ACTION';
export const SESSION_REFRESH_SUCCESS_ACTION = 'SESSION_REFRESH_SUCCESS_ACTION';

export const attemptToCallApiWithExpiredTokenAction = data => ({
  type: ATTEMPT_TO_CALL_API_WITH_EXPIRED_TOKEN_ACTION,
  data,
});

export const sesssionRefreshSuccessAction = data => ({
  type: SESSION_REFRESH_SUCCESS_ACTION,
  data,
});
