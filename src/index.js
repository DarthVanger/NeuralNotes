import React from 'react';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import 'vis-network/dist/vis-network.css';
import 'react-toastify/dist/ReactToastify.css';
import 'sagas';
import { App } from 'components/App/App';
import { store, history } from 'sagas';
import { GlobalStyle } from 'globalStyles';
import { ConnectedRouter } from 'connected-react-router';

// The app flow is following:
// 1) The global code is executed. So if you have first line in js file like console.log() it will be execute
// 2) redux-saga is imported before React, so saga's run() function will execute, and all effects will run in parallel
// 3) The code inside React components will execute
// 4) Saga's effects finish executing

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <GlobalStyle />
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app-root'),
);
