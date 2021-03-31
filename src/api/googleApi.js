import {
  clientId,
  apiKey,
  scope,
  discoveryDocs,
} from 'api/google-client-config';
import auth from 'auth';
import * as googleApiLoader from './googleApiLoader';

export const loadGoogleApi = async () => {
  const gapi = await googleApiLoader.loadGoogleApi();

  await gapi.client.init({
    apiKey,
    clientId,
    discoveryDocs,
    scope: scope,
  });

  if (auth.signedIn()) {
    gapi.client.setToken({
      access_token: auth.getToken(),
    });
  }
};
