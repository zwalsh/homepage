import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import api from './api';
import Header from './Header';
import Background from './Background';

export default function root_init(node, store) {
  // todo - join session with cookie here probably
  ReactDOM.render(
    <Provider store={store}>
      <Root />
    </Provider>,
    node
  );
}

class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Router>
          <Background />
          <Header />
          <div>Good Afternoon, Zach</div>
        </Router>
      </div>
    );
  }
}
