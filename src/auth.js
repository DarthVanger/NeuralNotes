export default {
  haveToken: haveToken,
  saveToken: saveToken,
  getToken: getToken,
  signedIn: signedIn,
  logout: logout,
};

function signedIn() {
  return haveToken();
}

function haveToken() {
  let token = window.localStorage.getItem('gapiAccessToken');
  let expDate = window.localStorage.getItem('gapiAccessTokenExpirationDate');
  if (token && expDate) {
    return new Date(expDate) > new Date();
  } else {
    return false;
  }
}

function saveToken(tokenObject) {
  let access_token = tokenObject.access_token;
  let expires_in = tokenObject.expires_in;

  if (!expires_in) {
    throw new Error('Acess token date is undefined, can not save the token');
  }

  window.localStorage.setItem('gapiAccessToken', access_token);
  let expDate = new Date();
  expDate.setSeconds(expDate.getSeconds() + parseInt(expires_in));
  window.localStorage.setItem(
    'gapiAccessTokenExpirationDate',
    expDate.toISOString(),
  );
  console.info('access token saved in localStorage');
}

function getTokenExpirationDate() {
  return new Date(localStorage.getItem('gapiAccessTokenExpirationDate'));
}

function getToken() {
  return window.localStorage.getItem('gapiAccessToken');
}

function logout() {
  window.localStorage.removeItem('gapiAccessToken');
  window.localStorage.removeItem('gapiAccessTokenExpirationDate');
  window.location.assign('/');
}

export const didSessionExpire = () => {
  // add 10 seconds to now to be on the safe side in case
  // when http request is made after this check and it reaches Google API
  // after a few seconds, during which the token might expire
  const now = new Date(Date.now() + 10000);

  return getTokenExpirationDate() < now;
};
