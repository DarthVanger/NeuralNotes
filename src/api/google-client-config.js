// Developer Console, https://console.developers.google.com
export const clientId = process.env.GAPI_CLIENT_ID;

export const apiKey = process.env.GAPI_API_KEY;

// Per-file access to files created or opened by the app
export const scope = 'https://www.googleapis.com/auth/drive.file';

export const discoveryDocs = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];
