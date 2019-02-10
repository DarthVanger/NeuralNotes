console.debug('login.js');
import thoughtStorage from 'storage/thought-storage';
import googleDriveApi from 'api/google-drive-api';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import { gapiAuthorize } from 'api/google-login';
import loginPageHTML from 'text!./login.html';
import googleApiLoader from 'api/google-api-loader';
import './slide-1.png';
import './slide-2.png';
import './slide-3.png';
import './slide-4.png';
import './login.css';

let element;

let spinner = siteGlobalLoadingBar.create('login');

let redirectToNotesPage;

export default {
  render: render,
  unmount: unmount
};

function render(props) {
  redirectToNotesPage = props.redirectToNotesPage;

  element = document.createElement('div');
  element.innerHTML = loginPageHTML;

  onRender();
  return element;
}

function onRender() {
  let authorizeButton = element.querySelector('#authorize-button');
  authorizeButton.style.display = 'none';
  googleApiLoader.load().then(function () {
    authorizeButton.style.display = 'inline-block';
    authorizeButton.addEventListener('click', handleAuthClick);
  });
}

function unmount() {
  element.remove();
}


/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  console.debug('login.handleAuthClick()');
  let spinnerName = 'Loading google auth';
  siteGlobalLoadingBar.show(spinnerName);

  gapiAuthorize()
    .then(function (authResult) {
      console.debug('login.js: auth success! calling thoughtStorage.scanDrive()');
      siteGlobalLoadingBar.hide(spinnerName);
      //return handleAuthResult(authResult);
    })
    .then(googleDriveApi.loadDriveApi)
    .then(thoughtStorage.scanDrive)
    .then(function () {
      console.info('login: drive scanned, redirecting to the app main page');
      redirectToNotesPage();
    });

  return false;
}