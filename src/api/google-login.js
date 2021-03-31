/* global gapi */
import auth from 'auth';

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
        access_token: auth.getToken(),
      });

      resolve();
    }
  });
}

export function gapiAuthorize() {
  return gapi.auth2
    .getAuthInstance()
    .signIn()
    .then(googleUser => {
      const authResult = googleUser.getAuthResponse();
      console.debug('googleLogin.gapiAuthorize(): authResult: ', authResult);

      console.debug(
        'googleLogin.gapiAuthorize(): auth sucess! authResult: ',
        authResult,
      );

      auth.saveToken({
        access_token: authResult.access_token,
        expires_in: authResult.expires_in,
      });
    });
}
