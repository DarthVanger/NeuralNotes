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
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      function handleAuthClick(event) {
          console.debug('login.handleAuthClick()');

          var spinnerName = 'loading google drive login';
          siteGlobalLoadingBar.show(spinnerName);
          googleLogin.gapiAuthorize()
              .then(function(authResult) {
                  siteGlobalLoadingBar.hide(spinnerName);
                  return googleLogin.handleAuthResult(authResult);
              })
              .then(thoughtStorage.scanDrive)
              .then(function() {
                  console.debug('login: drive scanned');
                  console.debug('login: redirecting to /view-thoughts');
                  router.go('view-thoughts');
              });
          return false;
      }


});
