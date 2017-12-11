import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Button from '../Button/Button';

import './Header.css';

const Header = ({ isAuthenticated, onLoginClick, onLogoutClick }) => (
  <header className="app-header">
    <section>
      <h1 className="app-title">
        <Link exact="true" to="/" href="/">
          Confriends
        </Link>
      </h1>
      <div className="app-controls">
        {isAuthenticated() ? (
          <Button onClick={onLogoutClick}>Log out</Button>
        ) : (
          <Button onClick={onLoginClick}>Log in</Button>
        )}
      </div>
    </section>
  </header>
);

Header.propTypes = {
  isAuthenticated: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};

export default Header;
