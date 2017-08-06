define([
    'URI'
], function(
    URI 
) {
    var service = {
        get: get,
        update: update
    };

    return service;

    function update(thoughtId) {
        var uri = new URI(window.location);
        uri.search({ thoughtId: thoughtId });
        window.location.search = uri.search();
    }

    function get() {
        var uri = new URI(window.location);
        return uri.search(true).thoughtId;
    }

});
