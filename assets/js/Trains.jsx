import React from 'react';
import { connect } from 'react-redux';

function Trains(props) {
  let { predictions } = props;
  let i = 0;
  let stops = _.map(predictions, p_arr => {
    i++;
    return <Stop key={i} nexts={p_arr} />;
  });
  return (
    <div className="trains-wrapper">
      <a href="#trains" data-toggle="collapse">
        Next Trains
      </a>
      <div id="trains" className="collapse">
        <div className="background-blur" />
        <table>
          <tbody>{stops}</tbody>
        </table>
      </div>
    </div>
  );
}

function Stop(props) {
  let { nexts } = props;
  let route = nexts[0].route;
  let stop = nexts[0].stop;
  let dir = nexts[0].dir;
  let dest = nexts[0].dest;
  let color = nexts[0].color;
  let arr1 = nexts[0].status
    ? nexts[0].status
    : parseInt(nexts[0].min_to_arrival) +
      (parseInt(nexts[0].min_to_arrival) === 1 ? ' min' : ' mins');
  let arr2 = nexts[1].status
    ? nexts[1].status
    : parseInt(nexts[1].min_to_arrival) +
      (parseInt(nexts[1].min_to_arrival) === 1 ? ' min' : ' mins');

  return (
    <tr>
      <td style={{ color: `#${color}` }}>{route}</td>
      <td>
        {stop} -> {dest}
      </td>
      <td>{arr1}</td>
      <td>{arr2}</td>
    </tr>
  );
}

function state2props(state) {
  return { predictions: state.predictions };
}

export default connect(state2props)(Trains);
