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
      resp => {
        this.create_session(email, password);

        redirect();
      },
      (request, _status, _error) => {
        if (request) {
          console.log(request);
          alert('Username already taken');
        }
      }
    );
  }

  get_music(sliderVal) {
    return $.ajax('/api/track', {
      method: 'get',
      dataType: 'json',
      data: {
        session: store.getState().session,
        sliderVal: sliderVal
      },
      contentType: 'application/json; charset=UTF-8',
      success: resp => {
        store.dispatch({
          type: 'NEW_RECS',
          data: resp
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

  addSeed(user_id, spotify_id, artist, title) {
    return this.send_post('/api/tracks', {
      track: {
        user_id,
        spotify_id,
        artist,
        title
      }
    });
  }

  remove_seed(id) {
    return $.ajax('/api/tracks/' + id, {
      method: 'delete',
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      success: resp => {
        this.get_music();
      }
    });
  }
}

export default new Server();
