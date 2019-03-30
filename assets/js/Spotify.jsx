import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

function Header(props) {
  let { recs } = props;

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
