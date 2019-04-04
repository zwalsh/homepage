import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import store from './store';
import api from './api';

function Header(props) {
  let {
    recs,
    spotifyPlayer,
    session,
    danceabilitySliderVal,
    acousticnessSliderVal,
    energySliderVal,
    popularitySliderVal
  } = props;

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
    api.get_music();
  }

  function changeDanceabilitySliderVal(ev) {
    store.dispatch({
      type: 'NEW_DANCEABILITY_SLIDER_VAL',
      data: ev.target.value
    });
  }

  function changeAcousticnessSliderVal(ev) {
    store.dispatch({
      type: 'NEW_ACOUSTICNESS_SLIDER_VAL',
      data: ev.target.value
    });
  }

  function changeEnergySliderVal(ev) {
    store.dispatch({
      type: 'NEW_ENERGY_SLIDER_VAL',
      data: ev.target.value
    });
  }

  function changePopularitySliderVal(ev) {
    store.dispatch({
      type: 'NEW_POPULARITY_SLIDER_VAL',
      data: ev.target.value
    });
  }

  let seeds = [];

  if (recs && spotifyPlayer) {
    _.map(recs.tracks, track => {
      seeds.push(
        <tr key={track.id}>
          <td className="track-name">
            {track.title} - <span className="track-artist">{track.artist}</span>
          </td>
          <td
            onClick={ev => {
              removeSeed(ev);
            }}
            data-id={track.id}
            className="remove-seed"
          >
            Remove
          </td>
        </tr>
      );
    });
  }

  let danceability = (
    <tr>
      <td>Danceability:</td>
      <td>
        <input
          id="typeinp"
          type="range"
          min={0}
          max={1}
          value={danceabilitySliderVal}
          onChange={changeDanceabilitySliderVal}
          step={0.05}
        />
      </td>
    </tr>
  );

  let acousticness = (
    <tr>
      <td>Acousticness:</td>
      <td>
        <input
          id="typeinp"
          type="range"
          min={0}
          max={1}
          value={acousticnessSliderVal}
          onChange={changeAcousticnessSliderVal}
          step={0.05}
        />
      </td>
    </tr>
  );

  let energy = (
    <tr>
      <td>Energy:</td>
      <td>
        <input
          id="typeinp"
          type="range"
          min={0}
          max={1}
          value={energySliderVal}
          onChange={changeEnergySliderVal}
          step={0.05}
        />
      </td>
    </tr>
  );

  let popularity = (
    <tr>
      <td>Popularity:</td>
      <td>
        <input
          id="typeinp"
          type="range"
          min={0}
          max={100}
          value={popularitySliderVal}
          onChange={changePopularitySliderVal}
          step={1}
        />
      </td>
    </tr>
  );

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
            createSeed();
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
          <div className="background-blur" />
          <table>
            <tbody>{seeds}</tbody>
          </table>
          <table>
            <tbody>
              {acousticness}
              {danceability}
              {energy}
              {popularity}
            </tbody>
          </table>
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
    danceabilitySliderVal: state.danceabilitySliderVal,
    acousticnessSliderVal: state.acousticnessSliderVal,
    energySliderVal: state.energySliderVal,
    popularitySliderVal: state.popularitySliderVal
  };
}

export default connect(state2props)(Header);
