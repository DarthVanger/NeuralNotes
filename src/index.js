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

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <GlobalStyle />
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app-root'),
);
