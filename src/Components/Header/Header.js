/**
 * Header.js
 * @desc
 * @author BeS
 */

// react base
import React from 'react';
import PropTypes from 'prop-types';

// material ui components
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

// my components
import NavMain from '../NavMain/NavMain';
import NavUser from '../NavUser/NavUser';

// css
import './Header.css';

const Login = ({ onLoginClick }) => (
  <Button style={{ color: '#fff' }} onClick={onLoginClick}>
    Login
  </Button>
);

Login.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
};

const styles = {
  bigFlex: {
    flex: 1,
  },
};

const Header = ({ isAuthenticated, onLoginClick, onLogoutClick, classes }) => (
  <AppBar>
    <Toolbar>
      <NavMain />
      <Typography variant="title" color="inherit" className={classes.bigFlex}>
        Confriends
      </Typography>
      {isAuthenticated() ? (
        <NavUser onLogoutClick={onLogoutClick} />
      ) : (
        <Login onLoginClick={onLoginClick} />
      )}
    </Toolbar>
  </AppBar>
);

Header.propTypes = {
  isAuthenticated: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    bigFlex: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(Header);
