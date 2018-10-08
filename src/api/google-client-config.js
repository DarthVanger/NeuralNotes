define([
], function(
) {
    // Developer Console, https://console.developers.google.com
    var clientId = '586695064067-2k8v88rq1litcqj8v0ofnstj6t6qfhpa.apps.googleusercontent.com';

    var apiKey = 'AIzaSyAPXuniw1OFvl6OgeIuZp3NSbqfrjnw8qA';

    var scopes = [
        // Per-file access to files created or opened by the app
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata.readonly'
    ];

    var discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

    return {
        clientId: clientId,
        apiKey: apiKey,
        scopes: scopes,
        discoveryDocs: discoveryDocs
    };
});

