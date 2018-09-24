console.debug('login.js');
define([
    'storage/thought-storage',
    'auth-service',
    'api/google-drive-api',
    'ui/spinner/site-global-loading-bar',
    'api/cloud-api-loader',
    'api/google-login'
], function(
    thoughtStorage,
    authService,
    googleDriveApi,
    siteGlobalLoadingBar,
    cloudApiLoader,
    googleLogin
) {
    let element;

    var spinner = siteGlobalLoadingBar.create('login');

    return {
        render: render
    };

    function render() {
        element = document.querySelector('#authorize-button');
        //if (authService.authResult) {
        //    router.go('view-thoughts');
        //}
        //
        
        if (authService.authResult) {
            console.info('login.init(): user is already authorized');
            console.error('login.init(): redirecting to the main page is not implemented');
            //router.go('view-thoughts');
        }

        onRender();
        return  element;
    }

    function onRender() {
        console.debug('login.onRender(): adding click listener to authorizeButton');
        element.addEventListener('click', handleAuthClick);
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
                  console.info('login: drive scanned');
                  console.error('login.init(): redirecting to the main page is not implemented');
                  //router.go('view-thoughts');
              });
          return false;
      }


});
