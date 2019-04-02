import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import store from './store';
import api from './api';

function Header(props) {
  let { recs, spotifyPlayer, session, sliderVal, checkboxVal } = props;

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

  function createSeed() {
    api.addSeed(
      session.user_id,
      recs.rec.id,
      recs.rec.artists[0].name,
      recs.rec.name
    );
  }

  function removeSeed(ev) {
    api.remove_seed(ev.target.dataset.id);
  }

  function refresh() {
    api.get_music(checkboxVal ? sliderVal : null);
  }

  function changeSliderVal(ev) {
    store.dispatch({
      type: 'NEW_SLIDER_VAL',
      data: ev.target.value
    });
  }

  function changeCheckbox(ev) {
    store.dispatch({
      type: 'NEW_CHECKBOX_VAL',
      data: ev.target.checked
    });
  }

  let seeds = [];

  if (recs && spotifyPlayer) {
    _.map(recs.tracks, track => {
      seeds.push(
        <div key={track.id}>
          <span className="track-name">{track.title}</span> - &nbsp;
          {track.artist} &nbsp;
          <span
            onClick={ev => {
              removeSeed(ev);
            }}
            data-id={track.id}
            className="remove-seed"
          >
            Remove
          </span>
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
        width="250"
        height="330"
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
        <button
          onClick={() => {
            createSeed;
          }}
        >
          Add as seed
        </button>
        <button
          onClick={() => {
            refresh();
          }}
        >
          Refresh
        </button>
      </div>
      <div>
        <a href="#basedOn" data-toggle="collapse">
          Based On:
        </a>
        <div id="basedOn" className="collapse">
          {seeds}
          <span>
            Danceability: &nbsp;
            <input
              type="checkbox"
              value={checkboxVal}
              onChange={changeCheckbox}
            />
            &nbsp;
            <input
              id="typeinp"
              type="range"
              min="0"
              max="1"
              value={sliderVal}
              onChange={changeSliderVal}
              step="0.05"
            />
          </span>
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
    spotifyPlayer: state.spotifyPlayer,
    session: state.session,
    sliderVal: state.sliderVal,
    checkboxVal: state.checkboxVal
  };
}

export default connect(state2props)(Header);
