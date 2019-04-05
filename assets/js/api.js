import store from './store';
import channel from './channel';

class Server {
  send_post(path, data, callback, error_callback) {
    return $.ajax(path, {
      method: 'post',
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(data),
      success: callback,
      error: error_callback
    });
  }

  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  create_session(email, password) {
    return this.send_post(
      '/api/authorize',
      {
        email,
        password
      },
      resp => {
        this.setCookie('homepage-user-session', JSON.stringify(resp.data), 7);

        channel.init_channel(resp.data);
      },
      (request, _status, _error) => {
        if (request) {
          alert('Invalid Email or Password');
        }
      }
    );
  }

  create_user(first, last, email, password, redirect) {
    return this.send_post(
      '/api/users',
      {
        user: {
          first,
          last,
          email,
          password
        }
      },
      () => {
        this.create_session(email, password);
        redirect();
      },
      (request, _status, _error) => {
        if (request) {
          alert('Username already taken');
        }
      }
    );
  }

  get_music() {
    let options = {
      danceability: store.getState().danceabilitySliderVal,
      acousticness: store.getState().acousticnessSliderVal,
      energy: store.getState().energySliderVal,
      popularity: store.getState().popularitySliderVal
    };
    let seeds = store.getState().seeds;
    return $.ajax('/api/track', {
      method: 'get',
      dataType: 'json',
      data: {
        options,
        seeds
      },
      contentType: 'application/json; charset=UTF-8',
      success: resp => {
        store.dispatch({
          type: 'NEW_REC',
          data: resp.rec
        });
        
        store.dispatch({
          type: 'NEW_SPOTIFY_PLAYER',
          data: {
            spotifyType: 'track',
            spotifyId: resp.rec.id
          }
        });
      }
    });
  }

  get_seeds() {
    let session = store.getState().session;
    return $.ajax('/api/seeds', {
      method: 'get',
      dataType: 'json',
      data: {
        session
      },
      contentType: 'application/json; charset=UTF-8',
      success: resp => {
        store.dispatch({
          type: "NEW_SEEDS",
          data: resp.seeds
        });
      }
    });
  }

  addSeed(user_id, spotify_id, artist, title) {
    return this.send_post('/api/tracks', {
      track: {
        user_id,
        spotify_id,
        artist,
        title
      }
    },
    () => {
      this.get_seeds();
    });
  }

  remove_seed(id) {
    return $.ajax('/api/tracks/' + id, {
      method: 'delete',
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      success: () => {
        this.get_seeds();
      }
    });
  }
}

export default new Server();
