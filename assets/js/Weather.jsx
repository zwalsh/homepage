import React from 'react';
import { connect } from 'react-redux';
import store from './store';

function Weather(props) {
  let { forecast, weatherToggle } = props;

  function changeToggle() {
    let toggle = weatherToggle == 'More' ? 'Less' : 'More';
    store.dispatch({
      type: 'NEW_WEATHER_TOGGLE',
      data: toggle
    });
  }

  return forecast ? (
    <div className="weather-wrapper">
      <div>
        <span>{forecast.current.temp_f} °F</span> &nbsp; | &nbsp;
        <span>{forecast.current.condition.text}</span> &nbsp;
        <img className="weather-icon" src={forecast.current.condition.icon} />
      </div>
      <div onClick={changeToggle}>
        <a href="#weather" data-toggle="collapse">
          {weatherToggle}
        </a>
      </div>
      <div id="weather" className="collapse">
        <div> High: {forecast.forecast.forecastday[0].day.maxtemp_f} °F</div>
        <div> Low: {forecast.forecast.forecastday[0].day.mintemp_f} °F</div>
        <div>
          Avg Humidity: {forecast.forecast.forecastday[0].day.avghumidity}
        </div>
        <div> Sunrise: {forecast.forecast.forecastday[0].astro.sunrise}</div>
        <div> Sunset: {forecast.forecast.forecastday[0].astro.sunset}</div>
        <div>
          Wind: {forecast.current.wind_mph} mph {forecast.current.wind_dir}
        </div>
        <div>Precip: {forecast.current.precip_in}"</div>
      </div>
    </div>
  ) : (
    <span />
  );
}

function state2props(state) {
  return { forecast: state.forecast, weatherToggle: state.weatherToggle };
}

export default connect(state2props)(Weather);
