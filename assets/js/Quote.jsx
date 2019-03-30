import React from 'react';
import { connect } from 'react-redux';

function Quote(props) {
  let { quote } = props;

  return quote ? (
    <div className="quote-wrapper">
      <div className="quote-text">"{quote.quoteText}"</div>
      <div>- {quote.quoteAuthor}</div>
    </div>
  ) : (
    <span />
  );
}

function state2props(state) {
  return { quote: state.quote };
}

export default connect(state2props)(Quote);
