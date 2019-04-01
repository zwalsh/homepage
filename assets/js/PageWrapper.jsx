import React from 'react';
import { connect } from 'react-redux';

import Background from './Background';
import Clock from './Clock';
import Spotify from './Spotify';
import Quote from './Quote';
import Weather from './Weather';

function PageWrapper(props) {
  let { session, recs } = props;

  let auth = recs ? <span /> : <a href="/authorize">Auth Spotify</a>;

  return session ? (
    <div>
      <Background />
      <Weather />
      <Clock />
      {auth}
      <Quote />
      <Spotify />
    </div>
  ) : (
    <span />
  );
}

function state2props(state) {
  return { session: state.session, recs: state.recs };
}

export default connect(state2props)(PageWrapper);
