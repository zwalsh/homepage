import React from 'react';
import { connect } from 'react-redux';

function Background(props) {
  return props.bg_img ? (
    <div
      className="bg vignette-shadow"
      style={{ backgroundImage: `url(${props.bg_img})` }}
    />
  ) : (
    <span />
  );
}

function state2props(state) {
  return { bg_img: state.bg_img };
}

export default connect(state2props)(Background);
