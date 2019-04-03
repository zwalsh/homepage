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
    danceabilityCheckboxVal,
    acousticnessSliderVal,
    acousticnessCheckboxVal,
    energySliderVal,
    energyCheckboxVal,
    popularitySliderVal,
    popularityCheckboxVal
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
    api.get_music({
      danceability: danceabilityCheckboxVal ? danceabilitySliderVal : null,
      acousticness: acousticnessCheckboxVal ? acousticnessSliderVal : null,
      energy: energyCheckboxVal ? energySliderVal : null,
      popularity: popularityCheckboxVal ? popularitySliderVal : null
    });
  }

  function changeDanceabilitySliderVal(ev) {
    store.dispatch({
      type: 'NEW_DANCEABILITY_SLIDER_VAL',
      data: ev.target.value
    });
  }

  function changeDanceabilityCheckboxVal(ev) {
    store.dispatch({
      type: 'NEW_DANCEABILITY_CHECKBOX_VAL',
      data: ev.target.checked
    });
  }

  function changeAcousticnessSliderVal(ev) {
    store.dispatch({
      type: 'NEW_ACOUSTICNESS_SLIDER_VAL',
      data: ev.target.value
    });
  }

  function changeAcousticnessCheckboxVal(ev) {
    store.dispatch({
      type: 'NEW_ACOUSTICNESS_CHECKBOX_VAL',
      data: ev.target.checked
    });
  }

  function changeEnergySliderVal(ev) {
    store.dispatch({
      type: 'NEW_ENERGY_SLIDER_VAL',
      data: ev.target.value
    });
  }

  function changeEnergyCheckboxVal(ev) {
    store.dispatch({
      type: 'NEW_ENERGY_CHECKBOX_VAL',
      data: ev.target.checked
    });
  }

  function changePopularitySliderVal(ev) {
    store.dispatch({
      type: 'NEW_POPULARITY_SLIDER_VAL',
      data: ev.target.value
    });
  }

  function changePopularityCheckboxVal(ev) {
    store.dispatch({
      type: 'NEW_POPULARITY_CHECKBOX_VAL',
      data: ev.target.checked
    });
  }

  let seeds = [];

  if (recs && spotifyPlayer) {
    _.map(recs.tracks, track => {
      seeds.push(
        <tr key={track.id}>
          <td className="track-name">{track.title}</td>
          <td>-</td>
          <td>{track.artist}</td>
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
          type="checkbox"
          value={danceabilityCheckboxVal}
          onChange={changeDanceabilityCheckboxVal}
        />
      </td>
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
          type="checkbox"
          value={acousticnessCheckboxVal}
          onChange={changeAcousticnessCheckboxVal}
        />
      </td>
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
          type="checkbox"
          value={energyCheckboxVal}
          onChange={changeEnergyCheckboxVal}
        />
      </td>
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
          type="checkbox"
          value={popularityCheckboxVal}
          onChange={changePopularityCheckboxVal}
        />
      </td>
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
    danceabilityCheckboxVal: state.danceabilityCheckboxVal,
    acousticnessSliderVal: state.acousticnessSliderVal,
    acousticnessCheckboxVal: state.acousticnessCheckboxVal,
    energySliderVal: state.energySliderVal,
    energyCheckboxVal: state.energyCheckboxVal,
    popularitySliderVal: state.popularitySliderVal,
    popularityCheckboxVal: state.popularityCheckboxVal
  };
}

export default connect(state2props)(Header);
