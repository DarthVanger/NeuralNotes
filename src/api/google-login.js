/* global gapi */
import uiErrorNotification from 'ui/ui-error-notification';
import auth from 'auth';
import {
  clientId,
  scopes
} from 'api/google-client-config';

/**
 * Check if current user has authorized this application.
 */
export function checkAuth() {
  console.debug('googleLogin.checkAuth()');
  console.log('googleLogin.checkAuth() (calling gapiAuthorize())');
  return new Promise(resolve => {
    if (!auth.haveToken()) {
      console.info('User token expired, authorize again');
      gapiAuthorize().then(resolve);
    } else {
      console.info('User token is still valid');
      gapi.client.setToken({
        access_token: auth.getToken()
      });

      resolve();
    }
  });
}

export function gapiAuthorize() {
  console.debug('googleLogin.gapiAuthorize(): clientId: ', clientId);
  console.debug('googleLogin.gapiAuthorize(): scopes: ', scopes);
  return new Promise((resolve, reject) => {
    gapi.auth.authorize({
      client_id: clientId,
      scope: scopes.join(' '),
      immediate: false
    }, function (authResult) {
      console.debug('googleLogin.gapiAuthorize(): authResult: ', authResult);
      if (authResult.error) {
        uiErrorNotification.show('Google Authentification failed: ' + authResult.error);
        console.error('googleLogin.gapiAuthorize(): authError: ', authResult.error);
        reject(authResult);
      } else {
        auth.saveToken({
          access_token: authResult.access_token,
          expires_in: authResult.expires_in
        });

        console.debug('googleLogin.gapiAuthorize(): auth sucess! authResult: ', authResult);
        resolve(authResult);
      }
    });
  });
}
