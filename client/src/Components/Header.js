import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import Button from './Button';

const Header = ({ isAuthenticated, onLoginClick, onLogoutClick }) => (
  <header className="app-header">
    <h1 className="app-title">
      <Link exact="true" to="/" href="/">
        Confriends
      </Link>
    </h1>
    <nav>
      <ul className="nav-list">
        <li className="nav-list__item">
          <NavLink activeClassName="active" to="/conferences">
            Conferences
          </NavLink>
        </li>
        <li className="nav-list__item">
          <NavLink activeClassName="active" to="/team-building">
            Team Building
          </NavLink>
        </li>
        {isAuthenticated() && (
          <li className="nav-list__item">
            <NavLink activeClassName="active" to="/profile">
              Profile
            </NavLink>
          </li>
        )}
        <li className="nav-list__item">
          {isAuthenticated() ? (
            <Button onClick={onLogoutClick}>Log out</Button>
          ) : (
            <Button onClick={onLoginClick}>Log in</Button>
          )}
        </li>
      </ul>
    </nav>
  </header>
);

Header.propTypes = {
  isAuthenticated: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};

export default Header;
