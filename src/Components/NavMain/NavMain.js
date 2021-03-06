/**
 * NavMain.js
 * @desc
 * @author BeS
 */

// react base
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// react extensions
import { Link } from 'react-router-dom';

// utilities
import classNames from 'classnames';

// material ui components
import { withStyles } from 'material-ui/styles';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Grow from 'material-ui/transitions/Grow';
import { MenuItem, MenuList } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

// material ui icons
import NavigationClose from 'material-ui-icons/Close';
import MenuIcon from 'material-ui-icons/Menu';

// css
import './NavMain.css';

const styles = {
  popperClose: {
    pointerEvents: 'none',
  },
  popperOpen: {
    zIndex: 1,
  },
};

class NavMain extends Component {
  state = {
    navIsExpanded: false,
  };

  openMenu = () => {
    this.setState({ navIsExpanded: true });
  };

  closeMenu = () => {
    this.setState({ navIsExpanded: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Manager>
        <Target>
          <IconButton
            aria-owns={this.state.navIsExpanded ? 'menu-list' : null}
            aria-haspopup="true"
            onClick={this.state.navIsExpanded ? this.closeMenu : this.openMenu}
          >
            {this.state.navIsExpanded ? (
              <NavigationClose style={{ fill: '#fff' }} />
            ) : (
              <MenuIcon style={{ fill: '#fff' }} />
            )}
          </IconButton>
        </Target>
        <Popper
          placement="bottom-start"
          eventsEnabled={this.state.navIsExpanded}
          className={classNames({
            [classes.popperClose]: !this.state.navIsExpanded,
            [classes.popperOpen]: this.state.navIsExpanded,
          })}
        >
          <ClickAwayListener onClickAway={this.closeMenu}>
            <Grow
              in={this.state.navIsExpanded}
              id="menu-list"
              style={{ transformOrigin: '0 0 0' }}
            >
              <Paper>
                <MenuList role="menu">
                  <MenuItem onClick={this.closeMenu} component={Link} to="/">
                    Home
                  </MenuItem>
                  <MenuItem
                    onClick={this.closeMenu}
                    component={Link}
                    to="/conferences"
                  >
                    Conferences
                  </MenuItem>
                </MenuList>
              </Paper>
            </Grow>
          </ClickAwayListener>
        </Popper>
      </Manager>
    );
  }
}

NavMain.propTypes = {
  classes: PropTypes.shape({
    popperClose: PropTypes.string.isRequired,
    popperOpen: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(NavMain);
