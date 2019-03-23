import store from './store';

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

  create_session(email, password) {
    return this.send_post(
      '/api/v1/auth',
      {
        email,
        password
      },
      resp => {
        store.dispatch({
          type: 'NEW_SESSION',
          data: resp.data
        });
      },
      (request, _status, _error) => {
        if (request) {
          alert('Invalid Email or Password');
        }
      }
    );
  }
}

export default new Server();
