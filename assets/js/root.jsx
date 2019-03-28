import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';

import Header from './Header';
import Background from './Background';
import Clock from './Clock';

export default function root_init(node, store) {
  ReactDOM.render(
    <CookiesProvider>
      <Provider store={store}>
        <Router>
          <Background />
          <Header />
          <Clock />
          <a href="/authorize">Auth Spotify</a>
        </Router>
      </Provider>
    </CookiesProvider>,
    node
  );
}
