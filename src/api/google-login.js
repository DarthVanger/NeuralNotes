/* global gapi */
import auth from 'auth';

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
