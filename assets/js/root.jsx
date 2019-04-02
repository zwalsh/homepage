import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';

import PageWrapper from './PageWrapper';
import Header from './Header';
import RegisterForm from './RegisterForm';

export default function root_init(node, store) {
  ReactDOM.render(
    <CookiesProvider>
      <Provider store={store}>
        <Router>
          <Route
            path="/"
            exact={true}
            render={() => (
              <div>
                <Header />
                <PageWrapper />
              </div>
            )}
          />
          <Route
            path="/register"
            exact={true}
            render={() => <RegisterForm />}
          />
        </Router>
      </Provider>
    </CookiesProvider>,
    node
  );
}
