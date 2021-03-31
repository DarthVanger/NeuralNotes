/* global gapi */

/**
 * Loads the official Google api.js (gapi) with the auth2 client.
 *
 * Usage:
 * loadGoogleApi.then(gapi => console.log('gapi: ', gapi));
 */
export const loadGoogleApi = async () => {
  await loadScript('https://apis.google.com/js/api.js');

  return new Promise(resolve => {
    gapi.load('client:auth2', () => {
      resolve(gapi);
    });
  });
};

// from a JS fiddle: https://jsfiddle.net/doktormolle/7cu2F/
function loadScript(src) {
  return new Promise(resolve => {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = resolve;
    document.getElementsByTagName('head')[0].appendChild(script);
    script.src = src;
  });
}
