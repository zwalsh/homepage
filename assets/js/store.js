import { createStore, combineReducers } from 'redux';
import deepFreeze from 'deep-freeze';

function user(state = null, action) {
  switch (action.type) {
    default:
      return state;
  }
}

function session(state = null, action) {
  switch (action.type) {
    case 'NEW_SESSION':
      return action.data;
    case 'LOGOUT_SESSION':
      return null;
    default:
      return state;
  }
}

function bg_img(state = null, action) {
  switch (action.type) {
    case 'NEW_BG_IMG':
      return action.data;
    default:
      return state;
  }
}

function forecast(state = null, action) {
  switch (action.type) {
    case 'NEW_WEATHER':
      return action.data;
    default:
      return state;
  }
}

function recs(state = null, action) {
  switch (action.type) {
    case 'NEW_RECS':
      return action.data;
    case 'REC_REMOVE':
      return state;
    default:
      return state;
  }
}

function spotifyPlayer(state = null, action) {
  switch (action.type) {
    case 'NEW_SPOTIFY_PLAYER':
      return action.data;
    default:
      return state;
  }
}

function quote(state = null, action) {
  switch (action.type) {
    case 'NEW_QUOTE':
      return action.data;
    default:
      return state;
  }
}

function weatherToggle(state = 'More', action) {
  switch (action.type) {
    case 'NEW_WEATHER_TOGGLE':
      return action.data;
    default:
      return state;
  }
}

function predictions(state = [], action) {
  switch (action.type) {
    case 'NEW_PREDICTIONS':
      return action.data;
    default:
      return state;
  }
}

function root_reducer(state0, action) {
  // console.log('reducer', state0, action);

  let reducer = combineReducers({
    user,
    session,
    bg_img,
    forecast,
    recs,
    spotifyPlayer,
    quote,
    weatherToggle,
    predictions
  });

  let state1 = reducer(state0, action);

  // console.log('reducer1', state1);

  return deepFreeze(state1);
}

let store = createStore(root_reducer);
export default store;
