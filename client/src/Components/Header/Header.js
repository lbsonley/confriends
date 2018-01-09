// react base
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// react extensions
import { Link } from 'react-router-dom';

// material ui components
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

// material ui icons
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

// my components
import Button from '../Button/Button';

// css
import './Header.css';

const Login = ({ onLoginClick }) => (
  <FlatButton
    style={{ color: 'rgb(48, 48, 48)' }}
    label="Login"
    onClick={onLoginClick}
  />
);
Login.muiName = 'FlatButton';

const LoggedIn = ({ onLogoutClick }) => (
  <IconMenu
    iconStyle={{ color: 'rgb(48, 48, 48)' }}
    iconButtonElement={
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    }
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    <MenuItem containerElement={<Link to="/profile" />} primaryText="Profile" />
    <MenuItem primaryText="Sign out" onClick={onLogoutClick} />
  </IconMenu>
);
LoggedIn.muiName = 'IconMenu';

class Header extends Component {
  constructor() {
    super();
    this.state = { navIsExpanded: false };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState({ navIsExpanded: !this.state.navIsExpanded });
  }

  render() {
    const { isAuthenticated, onLoginClick, onLogoutClick } = this.props;

    return (
      <header className="app-header">
        <AppBar
          title="Confriends"
          iconElementLeft={
            // <IconButton
            // >
            //   {this.state.navIsExpanded ? <NavigationClose /> : <MenuIcon />}
            // </IconButton>
            <IconMenu
              iconStyle={{ color: 'rgb(48, 48, 48)' }}
              iconButtonElement={
                <IconButton>
                  {this.state.navIsExpanded ? (
                    <NavigationClose />
                  ) : (
                    <MenuIcon />
                  )}
                </IconButton>
              }
              open={this.state.navIsExpanded}
              onClick={this.toggleMenu}
              onItemClick={this.toggleMenu}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
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
            </IconMenu>
          }
          iconElementRight={
            isAuthenticated() ? (
              <LoggedIn onLogoutClick={onLogoutClick} />
            ) : (
              <Login onLoginClick={onLoginClick} />
            )
          }
        />
        {/* <section>
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
        </section> */}
      </header>
    );
  }
}

Header.propTypes = {
  isAuthenticated: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};

export default Header;
