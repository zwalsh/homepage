import React from 'react';
import { withRouter } from 'react-router-dom';

import api from './api';

const RegisterForm = withRouter(({ history }) => {
  let firstName, lastName, email, password;

  function updateFirstName(ev) {
    firstName = ev.target.value;
  }

  function updateLastName(ev) {
    lastName = ev.target.value;
  }

  function updateEmail(ev) {
    email = ev.target.value;
  }

  function updatePassword(ev) {
    password = ev.target.value;
  }

  function redirect() {
    history.push('/');
  }

  function register() {
    api.create_user(firstName, lastName, email, password, redirect);
  }

  let registerForm = (
    <div className="form no-shadow">
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          className="form-control"
          onChange={updateFirstName}
        />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input type="text" className="form-control" onChange={updateLastName} />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="text" className="form-control" onChange={updateEmail} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          onChange={updatePassword}
          onKeyPress={e => {
            if (e.key == 'Enter') {
              register();
            }
          }}
        />
      </div>
      <button className="btn btn-primary" onClick={register}>
        Register
      </button>
    </div>
  );

  return (
    <div className="mb-2 no-shadow">
      <div>
        <h1>Your Homepage</h1>
      </div>
      <div>{registerForm}</div>
    </div>
  );
});

export default RegisterForm;
