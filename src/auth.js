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

function getToken() {
  return window.localStorage.getItem('gapiAccessToken');
}

function logout() {
  window.localStorage.removeItem('gapiAccessToken');
  window.localStorage.removeItem('gapiAccessTokenExpirationDate');
  window.location.assign('/');
}
