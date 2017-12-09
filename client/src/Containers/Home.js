import React from 'react';
import PropTypes from 'prop-types';

const Home = ({ isAuthenticated }) =>
  isAuthenticated() ? <h1>You are logged in!</h1> : <h1>Please Log in!</h1>;

Home.propTypes = {
  isAuthenticated: PropTypes.func.isRequired,
};

export default Home;
