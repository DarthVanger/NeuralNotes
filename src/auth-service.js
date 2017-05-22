define([
], function(
) {

	var service = {
        // google api auth result
        authResult: undefined,
		isAuthorized: isAuthorized
    };

	return service;

	function isAuthorized() {
		return Boolean(service.authResult);
	}

});
