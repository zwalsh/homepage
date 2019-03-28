import React from 'react';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsOffset: 0,
      minutesOffset: 0,
      hoursOffset: 0,
      secondsDegrees: 0,
      minutesDegrees: 0,
      hoursDegrees: 0,
      time: ''
    };

    this.setDate = this.setDate.bind(this);
  }

  componentDidMount() {
    setInterval(this.setDate, 1000);
  }

  setDate() {
    let secondsOffset = this.state.secondsOffset;
    let minutesOffset = this.state.minutesOffset;
    let hoursOffset = this.state.hoursOffset;

    let now = new Date();
    let seconds = now.getSeconds();
    let minutes = now.getMinutes();
    let hours = now.getHours();

    let secondsDegrees = (seconds / 60) * 360 + 90;
    let minutesDegrees = (minutes / 60) * 360 + (seconds / 60) * 6 + 90;
    let hoursDegrees =
      ((hours <= 12 ? hours : hours - 12) / 12) * 360 +
      (minutes / 60) * 30 +
      90;

    // TODO refactor these if statements into a function
    if (secondsDegrees == 90) {
      secondsOffset += 360;
    }
    secondsDegrees += secondsOffset;

    if (minutesDegrees == 90) {
      minutesOffset += 360;
    }
    minutesDegrees += minutesOffset;

    if (hoursDegrees == 90) {
      hoursOffset += 360;
    }
    hoursDegrees += hoursOffset;

    let secs = seconds < 10 ? '0' + seconds : seconds;
    let mins = minutes < 10 ? '0' + minutes : minutes;
    let hrs = hours <= 12 ? hours : hours - 12;
    let m = hours <= 12 ? ' AM' : ' PM';
    let time =
      secs % 2 == 0
        ? hrs + ':' + mins + ':' + secs + m
        : hrs + ' ' + mins + ' ' + secs + m;

    this.setState({
      time: time,
      secondsOffset: secondsOffset,
      minutesOffset: minutesOffset,
      hoursOffset: hoursOffset,
      secondsDegrees: secondsDegrees,
      minutesDegrees: minutesDegrees,
      hoursDegrees: hoursDegrees
    });
  }

  render() {
    return (
      <div className="clock">
        <div className="clock-face">
          <div className="time">{this.state.time}</div>
          <div
            className="hand hour-hand"
            style={{ transform: `rotate(${this.state.hoursDegrees}deg)` }}
          />
          <div
            className="hand min-hand"
            style={{ transform: `rotate(${this.state.minutesDegrees}deg)` }}
          />
          <div
            className="hand second-hand"
            style={{ transform: `rotate(${this.state.secondsDegrees}deg)` }}
          />
        </div>
      </div>
    );
  }
}

export default Clock;
