const apiUrl = `${location.protocol}//${location.hostname}:8081`;

export const saveUserLoginEvent = user => {
  return fetch(`${apiUrl}/event/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then(response => response.text());
};
