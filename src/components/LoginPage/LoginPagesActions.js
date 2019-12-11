export const REQUEST_AUTHORIZATION_ACTION = 'REQUEST_AUTHORIZATION_ACTION';
export const GOOGLE_API_INITIALIZED_ACTION = 'GOOGLE_API_INITIALIZED_ACTION';
export const AUTH_SUCCESS_ACTION = 'AUTH_SUCCESS_ACTION';

export const googleApiInitializedAction = () => ({ type: GOOGLE_API_INITIALIZED_ACTION });
export const authSuccessAction = () => ({ type: AUTH_SUCCESS_ACTION });
