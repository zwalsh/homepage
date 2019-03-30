import React from 'react';
import { connect } from 'react-redux';

function Weather(props) {
  let { forecast } = props;

  return forecast ? (
    <div className="weather-wrapper">
      <span>{forecast.current.temp_f} °F</span> &nbsp; | &nbsp;
      <span>{forecast.current.condition.text}</span> &nbsp;
      <img className="weather-icon" src={forecast.current.condition.icon} />
    </div>
  ) : (
    <span />
  );
}

function state2props(state) {
  return { forecast: state.forecast };
}

export default connect(state2props)(Weather);
