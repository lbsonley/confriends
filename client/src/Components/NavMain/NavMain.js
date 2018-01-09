// react base
import React from 'react';
import PropTypes from 'prop-types';

// react extensions
import { Link } from 'react-router-dom';
import Media from 'react-media';

// material ui components
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

// css
import './NavMain.css';

const NavMain = () => (
  <nav className="app-nav">
    <Paper>
      <Menu>
        <MenuItem
          primaryText="Dashboard"
          containerElement={<Link to="/dummy" />}
        />
        <MenuItem
          primaryText="Conferences"
          containerElement={<Link to="/conferences" />}
        />
        <MenuItem
          primaryText="Team Building"
          containerElement={<Link to="/team-building" />}
        />
      </Menu>
    </Paper>
    {/* <ul className="nav-list">
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
    </ul> */}
  </nav>
);

export default NavMain;
