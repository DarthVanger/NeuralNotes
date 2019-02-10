console.debug('cloid-api-loader.js');
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import {
  clientId,
  apiKey,
  scopes,
  discoveryDocs
} from 'api/google-client-config';
import auth from 'auth';
import scriptJS from "scriptjs";

function load() {
  return loadGoogleClient();
}

export default {load};

/**
 * Load google api script. It can't be hosted
 * on a private server, so need to get it from google server.
 * Also init google client.
 *
 * @return {Promise}
 */
function loadGoogleClient() {
  console.info('Loading Google Client...');
  let spinner = siteGlobalLoadingBar.create('login');
  let checkGapiSpinner = spinner.create('checking google login');
  return new Promise(function (resolve, reject) {
    scriptJS("https://apis.google.com/js/api.js", checkGAPI);

    // Poll until gapi is ready
    function checkGAPI() {
      console.debug('cloudApiLoader.checkGAPI()');
      checkGapiSpinner.show();
      if (gapi) {
        console.info('[Loaded] Google API');
        checkGapiSpinner.hide();

        loadGoogleApiClient();
      } else {
        setTimeout(checkGAPI, 100);
      }
    }

    function loadGoogleApiClient() {
      gapi.load('client:auth2', initClient);
      checkGapiClient();
    }

    function initClient() {
      console.debug('googleApiLoader.initClient()');
      gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: discoveryDocs,
        clientId: clientId,
        scope: scopes
      });
    }

    function checkGapiClient() {
      console.debug('cloudApiLoader.checkGapiClient()');
      if (gapi.client) {
        console.info('[Loaded] gapi.client');
        onGapiClientInit();
      } else {
        setTimeout(checkGapiClient, 100);
      }
    }

    function onGapiClientInit() {
      if (auth.signedIn()) {
        gapi.client.setToken({
          access_token: auth.getToken()
        });
      }

      resolve();
    }
  });
}