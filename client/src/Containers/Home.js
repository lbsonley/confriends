import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Components/Header';

const Home = ({ isAuthenticated, onLoginClick, onLogoutClick }) => (
  // isAuthenticated() ? <h1>You are logged in!</h1> : <h1>Please Log in!</h1>;

  <Header
    isAuthenticated={isAuthenticated}
    onLoginClick={onLoginClick}
    onLogoutClick={onLogoutClick}
  />
);

Home.propTypes = {
  isAuthenticated: PropTypes.func.isRequired,
};

export default Home;
