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
        Good {greeting}, {session.first}
      </div>
      <button className="btn btn-secondary" onClick={() => logout()}>
        Logout
      </button>
    </div>
  ) : (
    <div>
      <input type="email" placeholder="email" onChange={updateEmail} /> &nbsp;
      <input
        type="password"
        placeholder="password"
        onChange={updatePassword}
        onKeyPress={e => {
          if (e.key == 'Enter') {
            login();
          }
        }}
      />{' '}
      &nbsp;
      <button className="btn btn-secondary" onClick={login}>
        Login
      </button>
    </div>
  );

  return (
    <div className="mb-2">
      <div>
        <h1>My Homepage</h1>
      </div>
      <div>{session_info}</div>
    </div>
  );
}

function state2props(state) {
  return { session: state.session };
}

export default connect(state2props)(withCookies(Header));
