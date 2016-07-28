define([
    'https://apis.google.com/js/client.js?onload=checkAuth"',
    'storage',
    'router',
    'auth-service',
    'google-drive-api'
], function(
    // google creates global 'gapi' variable,
    // the one below is undefined.
    gapi_GLOBAL_VARIABLE_MODULE,
    storage,
    router,
    authService,
    googleDriveApi
) {
      // Developer Console, https://console.developers.google.com
      var CLIENT_ID = '586695064067-2k8v88rq1litcqj8v0ofnstj6t6qfhpa.apps.googleusercontent.com';

      var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

    //window.checkAuth = checkAuth;
    //window.setTimeout(checkAuth, 3000);

    return {
        init: init,
    };

    function init() {
         console.debug('login.init()');
          // Your Client ID can be retrieved from your project in the Google
         console.debug('gapi: ', gapi);

            $('#authorize-button').on('click', handleAuthClick);
    }

          /**
           * Handle response from authorization server.
           *
           * @param {Object} authResult Authorization result.
           */
          function handleAuthResult(authResult) {
            var authorizeDiv = document.getElementById('authorize-div');
            console.debug('authResult: ', authResult);
            if (authResult && !authResult.error) {
              authService.authResult = authResult;
              // Hide auth UI, then load client library.
              authorizeDiv.style.display = 'none';

              googleDriveApi.loadDriveApi().then(function() {
                  router.go('view-thoughts');
              });

            } else {
                console.debug('auth fail');
              // Show auth UI, allowing the user to initiate authorization by
              // clicking authorize button.
              authorizeDiv.style.display = 'inline';
            }
          }

          /**
           * Initiate auth flow in response to user clicking authorize button.
           *
           * @param {Event} event Button click event.
           */
          function handleAuthClick(event) {
              console.debug('handleAuthClick()');
            gapi.auth.authorize(
              {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
              handleAuthResult);
            return false;
          }

      /**
       * Check if current user has authorized this application.
       */
      function checkAuth() {
        console.debug('checkAuth()');
        gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      }

});
