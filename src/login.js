console.debug('login.js');
define([
    'thought/thought-storage',
    'router',
    'auth-service',
    'google-drive-api',
    'spinner/site-global-loading-bar',
    'api/cloud-api-loader',
    'api/google-login'
], function(
    thoughtStorage,
    router,
    authService,
    googleDriveApi,
    siteGlobalLoadingBar,
    cloudApiLoader,
    googleLogin
) {
    var spinner = siteGlobalLoadingBar.create('login');


    return {
        init: init,
        onRender: onRender
    };

    function init() {
        console.debug('login.init()');
        //if (thoughtStorage.restoreFromCache()) {
        //    console.debug('login.init(): cache restored, redirecting to "view-thoughts"');
        //    cloudApiLoader.loadInBackground();
        //    router.go('view-thoughts');

        //} else {
        //    console.debug('login.init(): no cache found, loading google client');
        //    //loadGoogleClient();
        //}

        //if (authService.authResult) {
        //    router.go('view-thoughts');
        //}
        //
        if (authService.authResult) {
            console.debug('login.init(): user already authorized, redirecting to "view-thoughts"');
            router.go('view-thoughts');
        }

    }

    function onRender() {
        console.debug('login.onRender(): adding click listener to authorizeButton');
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
                  console.debug('login.js: auth success! calling thoughtStorage.scanDrive()');
                  siteGlobalLoadingBar.hide(spinnerName);
                  //return googleLogin.handleAuthResult(authResult);
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
