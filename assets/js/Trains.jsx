import React from 'react';
import { connect } from 'react-redux';

function Trains(props) {
  let { predictions } = props;
  let stops = _.map(predictions, (p_arr) => {
    return <Stop nexts={p_arr} />;
  });
  return <div className="trains-wrapper">
            <h2>Next Trains</h2>
            { stops }
        </div>
}

function Stop(props) {
  let { nexts } = props;
  let route = nexts[0].route;
  let stop = nexts[0].stop;
  let dir = nexts[0].dir;
  let dest = nexts[0].dest;
  let color = nexts[0].color;
  let arr1 = nexts[0].status ? nexts[0].status : parseInt(nexts[0].min_to_arrival);
  let arr2 = nexts[1].status ? nexts[1].status : parseInt(nexts[1].min_to_arrival);

  return <div>
          <div><span style={{color: `#${color}`}}>{route}:</span> {stop} -> {dest} {arr1}, {arr2} mins</div>
        </div>;
}

function state2props(state) {
  return { predictions: state.predictions };
}

export default connect(state2props)(Trains);
