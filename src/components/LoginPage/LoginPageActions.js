export const REQUEST_AUTHORIZATION_ACTION = 'REQUEST_AUTHORIZATION_ACTION';
export const LOAD_GOOGLE_API_SUCCESS_ACTION = 'LOAD_GOOGLE_API_SUCCESS_ACTION';
export const AUTH_SUCCESS_ACTION = 'AUTH_SUCCESS_ACTION';

export const loadGoogleApiSuccessAction = () => ({
  type: LOAD_GOOGLE_API_SUCCESS_ACTION,
});
export const authSuccessAction = () => ({ type: AUTH_SUCCESS_ACTION });
