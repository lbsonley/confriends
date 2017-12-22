import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Media from 'react-media';

import './NavMain.css';

const NavMain = ({ isAuthenticated }) => (
  <nav className="app-nav">
    <ul className="nav-list">
      <Media
        query="(max-width: 480px)"
        render={() => (
          <li className="nav-list__item">
            <NavLink activeClassName="active" to="/dummy">
              Dashboard
            </NavLink>
          </li>
        )}
      />
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
    </ul>
  </nav>
);

NavMain.propTypes = {
  isAuthenticated: PropTypes.func.isRequired,
};

export default NavMain;