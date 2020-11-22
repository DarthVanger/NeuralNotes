import React from 'react';

import { ConnectedRouter } from 'connected-react-router';
import { GlobalStyle } from 'globalStyles';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store, history } from 'sagas';

import { App } from 'components/App/App';

import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import 'vis-network/dist/vis-network.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <GlobalStyle />
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app-root'),
);
