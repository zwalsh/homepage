import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import api from './api';
import channel from './channel';

function Header(props) {
  let { session, dispatch, cookies } = props;
  let session_info, email, password;

  if (!session) {
    let sessionObj = cookies.get('homepage-user-session');

    if (sessionObj) {
      channel.init_channel(sessionObj);
    }
  }

  let now = new Date().getHours();

  let greeting;

  if (now < 12) {
    greeting = 'Morning';
  } else if (now >= 12 && now < 17) {
    greeting = 'Afternoon';
  } else {
    greeting = 'Evening';
  }

  function updateEmail(ev) {
    email = ev.target.value;
  }

  function updatePassword(ev) {
    password = ev.target.value;
  }

  function login() {
    api.create_session(email, password);
  }

  function logout() {
    cookies.remove('homepage-user-session');
    let action = {
      type: 'LOGOUT_SESSION'
    };
    dispatch(action);
  }

  session_info = session ? (
    <div className="mb-2">
      <div>
        <h1>Your Homepage</h1>
      </div>
      <div className="mb-2">
        <div>
          Good {greeting}, {session.first}
        </div>
        <button className="btn btn-secondary" onClick={() => logout()}>
          Logout
        </button>
      </div>
    </div>
  ) : (
    <div className="mb-2 no-shadow">
      <div>
        <h1>Your Homepage</h1>
      </div>
      <div>
        <div className="form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              onChange={updateEmail}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              onChange={updatePassword}
              onKeyPress={e => {
                if (e.key == 'Enter') {
                  login();
                }
              }}
            />
          </div>
          <button className="btn btn-primary" onClick={login}>
            Login
          </button>
        </div>
        <div className="register">
          Don't have an account?{' '}
          <Link to={'/register'}>
            <button className="btn btn-secondary">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
  return session_info;
}

function state2props(state) {
  return { session: state.session };
}

export default connect(state2props)(withCookies(Header));
