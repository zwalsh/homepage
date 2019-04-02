import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import store from './store';

function Header(props) {
  let { recs, spotifyPlayer } = props;

  function changeType(ev) {
    let newId;
    let newType = ev.target.value.toLowerCase();

    switch (newType) {
      case 'track':
        newId = recs.rec.id;
        break;
      case 'album':
        newId = recs.rec.album.id;
        break;
      case 'artist':
        newId = recs.rec.artists[0].id;
        break;
    }
    store.dispatch({
      type: 'NEW_SPOTIFY_PLAYER',
      data: { spotifyType: newType, spotifyId: newId }
    });
  }

  let seeds = [];

  if (recs && spotifyPlayer) {
    _.map(recs.tracks, track => {
      seeds.push(
        <div key={track.id}>
          <span className="track-name">{track.title}</span> - &nbsp;
          {track.artist}
        </div>
      );
    });
  }

  return recs && spotifyPlayer ? (
    <span className="player">
      <iframe
        src={`https://open.spotify.com/embed/${spotifyPlayer.spotifyType}/${
          spotifyPlayer.spotifyId
        }`}
        width="320"
        height="400"
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
      />
      <div>
        <select onChange={changeType}>
          <option>Track</option>
          <option>Album</option>
          <option>Artist</option>
        </select>
      </div>
      <div>
        <a href="#basedOn" data-toggle="collapse">
          Based On:
        </a>
        <div id="basedOn" className="collapse">
          {seeds}
        </div>
      </div>
    </span>
  ) : (
    <span className="player">
      <a href="/authorize">Connect Spotify</a>
    </span>
  );
}

function state2props(state) {
  return {
    recs: state.recs,
    spotifyPlayer: state.spotifyPlayer
  };
}

export default connect(state2props)(Header);
