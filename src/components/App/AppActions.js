export const NOT_AUTHORIZED_USER_OPENED_APP = 'NOT_AUTHORIZED_USER_OPENED_APP';
export const AUTHORIZED_USER_OPENED_APP = 'AUTHORIZED_USER_OPENED_APP';
export const LOAD_GOOGLE_API_ACTION = 'LOAD_GOOGLE_API_ACTION';

export const authorizedUserOpenedApp = () => ({
  type: AUTHORIZED_USER_OPENED_APP,
});

export const notAuthorizedUserOpenedApp = () => ({
  type: NOT_AUTHORIZED_USER_OPENED_APP,
});

export const loadGoogleApiAction = () => ({
  type: LOAD_GOOGLE_API_ACTION,
});
