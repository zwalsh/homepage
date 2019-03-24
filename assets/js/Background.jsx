import React, { Component } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import api from './api';

function Background(props) {
  return (
    <div className="bg" style={{ backgroundImage: `url(${props.bg_img})` }} />
  );
}

function state2props(state) {
  return { bg_img: state.bg_img };
}

export default connect(state2props)(Background);
