define([
], function(
) {
    var service = {
        get: get,
        update: update
    };

    return service;

    function update(thoughtId) {
        window.location.hash = thoughtId;
    }

    function get() {
        return window.location.hash.substr(1);
    }

});
