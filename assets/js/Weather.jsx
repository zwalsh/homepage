import React from 'react';
import { connect } from 'react-redux';

function Weather(props) {
  let { forecast } = props;

  let toggle = 'More';

  // function changeToggle() {
  //   toggle
  // }

  return forecast ? (
    <div className="weather-wrapper">
      <div>
        <span>{forecast.current.temp_f} °F</span> &nbsp; | &nbsp;
        <span>{forecast.current.condition.text}</span> &nbsp;
        <img className="weather-icon" src={forecast.current.condition.icon} />
      </div>
      <div>
        <a href="#weather" data-toggle="collapse">
          {toggle}
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
      </div>
    </div>
  ) : (
    <span />
  );
}

function state2props(state) {
  return { forecast: state.forecast };
}

export default connect(state2props)(Weather);
