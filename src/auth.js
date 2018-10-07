define([
], function(
) {
    return {
        haveToken: haveToken,
        saveToken: saveToken,
        getToken: getToken,
        signedIn: signedIn
    };

    function signedIn() {
        return haveToken();
    }

    function haveToken() {
        var token = window.localStorage.getItem('gapiAccessToken');
        var expDate = window.localStorage.getItem('gapiAccessTokenExpirationDate');
        if (token && expDate) {
            return new Date(expDate) > new Date();
        } else {
            return false;
        }
    }

    function saveToken(tokenObject) {
        var access_token = tokenObject.access_token;
        var expires_in = tokenObject.expires_in;

        if (!expires_in) {
            throw new Error('Acess token date is undefined, can not save the token');
        }

        window.localStorage.setItem('gapiAccessToken', access_token);
        var expDate = new Date();
        expDate.setSeconds(expDate.getSeconds() + parseInt(expires_in));
        window.localStorage.setItem('gapiAccessTokenExpirationDate', expDate.toISOString());
        console.info('access token saved in localStorage');
    }

    function getToken() {
        return window.localStorage.getItem('gapiAccessToken');
    }

});
