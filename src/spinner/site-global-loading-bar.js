define([], function() {
    var loading = [];
    var $loadingBar = $('#site-global-loading-bar');

    var publicApi = {
        show: show,
        hide: hide
    };

    return publicApi;

    function show(name) {
        $loadingBar.show();
    }

    function hide(name) {
        $loadingBar.hide();
    }

});
