import React from 'react';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap-social/bootstrap-social.css';
import 'vis-network/dist/vis-network.css';
import 'react-toastify/dist/ReactToastify.css';
import 'sagas';
import { AppContainer } from 'components/App/AppContainer';
import { store } from 'sagas';
import { GlobalStyle } from 'globalStyles';

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyle/>
    <AppContainer/>
  </Provider>,
  document.getElementById('app-root')
);
