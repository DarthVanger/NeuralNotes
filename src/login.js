console.debug('login.js');
define([
    'thought/thought-storage',
    'router',
    'auth-service',
    'google-drive-api',
    'spinner/site-global-loading-bar',
    'api/cloud-api-loader'
], function(
    thoughtStorage,
    router,
    authService,
    googleDriveApi,
    siteGlobalLoadingBar,
    cloudApiLoader
) {
    // Developer Console, https://console.developers.google.com
    var CLIENT_ID = '586695064067-2k8v88rq1litcqj8v0ofnstj6t6qfhpa.apps.googleusercontent.com';

    var SCOPES = [
        // Per-file access to files created or opened by the app
        'https://www.googleapis.com/auth/drive.file',
        // Allows read-only access to file metadata and file content
        'https://www.googleapis.com/auth/drive.readonly'
    ];

    var spinner = siteGlobalLoadingBar.create('login');


    return {
        init: init,
    };

    function init() {
        console.debug('login.init()');
        if (thoughtStorage.restoreFromCache()) {
            console.debug('login.init(): cache restored, redirecting to "view-thoughts"');
            cloudApiLoader.loadInBackground();
            router.go('view-thoughts');

        } else {
            console.debug('login.init(): no cache found, loading google client');
            //loadGoogleClient();
        }

        if (authService.authResult) {
            router.go('view-thoughts');
        }
           
        console.debug('login.init()');
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

          googleDriveApi.loadDriveApi()
              .then(thoughtStorage.scanDrive)
              .then(function() {
                  console.debug('login: drive scanned');
                  console.debug('login: redirecting to /view-thoughts');
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
          console.debug('login.handleAuthClick()');

          var spinnerName = 'loading google drive login';
          siteGlobalLoadingBar.show(spinnerName);
          gapi.auth.authorize({
              client_id: CLIENT_ID,
              scope: SCOPES,
              immediate: false
          }, function(authResult) {
              siteGlobalLoadingBar.hide(spinnerName);
              handleAuthResult(authResult);
          });
          return false;
      }


});
