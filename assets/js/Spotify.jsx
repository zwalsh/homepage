import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

function Header(props) {
  let { recs } = props;

  let seeds = [];

  if (recs) {
    _.map(recs.tracks, track => {
      seeds.push(
        <div key={track.id}>
          {track.name} by {track.artists[0].name}
        </div>
      );
    });
  }

  return recs ? (
    <span className="player">
      <iframe
        src={`https://open.spotify.com/embed/track/${recs.rec.id}`}
        width="300"
        height="80"
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
      />
      <div>Based On:</div>
      {seeds}
    </span>
  ) : (
    <span />
  );
}

function state2props(state) {
  return { recs: state.recs };
}

export default connect(state2props)(Header);
