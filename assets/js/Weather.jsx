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
        <div className="background-blur" />
        <table>
          <tbody>
            <tr>
              <td>High</td>
              <td>{forecast.forecast.forecastday[0].day.maxtemp_f} °F</td>
            </tr>
            <tr>
              <td>Low</td>
              <td>{forecast.forecast.forecastday[0].day.mintemp_f} °F</td>
            </tr>
            <tr>
              <td>Avg Humidity</td>
              <td>{forecast.forecast.forecastday[0].day.avghumidity}</td>
            </tr>
            <tr>
              <td>Sunrise</td>
              <td>{forecast.forecast.forecastday[0].astro.sunrise}</td>
            </tr>
            <tr>
              <td>Sunset</td>
              <td>{forecast.forecast.forecastday[0].astro.sunset}</td>
            </tr>
            <tr>
              <td>Wind</td>
              <td>
                {forecast.current.wind_mph} mph {forecast.current.wind_dir}
              </td>
              <td />
            </tr>
            <tr>
              <td>Precip</td>
              <td>{forecast.current.precip_in}"</td>
            </tr>
          </tbody>
        </table>
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
