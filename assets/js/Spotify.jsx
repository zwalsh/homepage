import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import api from './api';
import channel from './channel';

function Header(props) {
  let { recs } = props;

  // console.log(recs[0].id);

  return recs.length > 0 ? (
    <iframe
      className="player"
      src={`https://open.spotify.com/embed/track/${recs[0].id}`}
      width="300"
      height="80"
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
    />
  ) : (
    <span />
  );
}

function state2props(state) {
  return { recs: state.recs };
}

export default connect(state2props)(Header);
