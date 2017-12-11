import React from 'react';
import PropTypes from 'prop-types';

const Button = props => (
  <button onClick={props.onClick}>{props.children}</button>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
};

export default Button;
