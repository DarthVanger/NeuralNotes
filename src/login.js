define([
    'https://apis.google.com/js/client.js?onload=checkAuth"',
    'storage',
    'router'
], function(
    gapi_GLOBAL_VARIABLE_MODULE,
    storage,
    router
) {

    return {
        init: init,
    };

    function init() {
          // Your Client ID can be retrieved from your project in the Google
         console.debug('gapi: ', gapi);
          // Developer Console, https://console.developers.google.com
          var CLIENT_ID = '586695064067-2k8v88rq1litcqj8v0ofnstj6t6qfhpa.apps.googleusercontent.com';

          var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

            $('#authorize-button').on('click', handleAuthClick);

          /**
           * Check if current user has authorized this application.
           */
          function checkAuth() {
            gapi.auth.authorize(
              {
                'client_id': CLIENT_ID,
                'scope': SCOPES.join(' '),
                'immediate': true
              }, handleAuthResult);
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
              // Hide auth UI, then load client library.
              authorizeDiv.style.display = 'none';
              loadDriveApi();
            } else {
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
           * Load Drive API client library.
           */
          function loadDriveApi() {
            gapi.client.load('drive', 'v3', listFiles);
          }

          /**
           * Print files.
           */
          function listFiles() {
            var request = gapi.client.drive.files.list({
                'pageSize': 10,
                'fields': "nextPageToken, files(id, name)"
              });

              request.execute(function(resp) {
                console.debug('resp: ', resp);
                storage.thoughts = resp.files;
                router.go('view-thoughts');
              });

          }
    }
});
