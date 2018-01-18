/**
 * NavUser.js
 * @desc
 * @author BeS
 */

// react base
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// utilities
import classNames from 'classnames';

// react extensions
import { Link } from 'react-router-dom';

// material ui components
import { withStyles } from 'material-ui/styles';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Grow from 'material-ui/transitions/Grow';
import { MenuItem, MenuList } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

// material ui icons
import MoreVertIcon from 'material-ui-icons/MoreVert';

const styles = {
  popperClose: {
    pointerEvents: 'none',
  },
};

class LoggedIn extends Component {
  state = {
    userMenuIsExpanded: false,
  };

  openMenu = () => {
    console.log('open User Menu');
    this.setState({ userMenuIsExpanded: true });
  };

  closeMenu = () => {
    console.log('close User Menu');
    this.setState({ userMenuIsExpanded: false });
  };

  render() {
    const { onLogoutClick } = this.props;

    return (
      <Manager>
        <Target>
          <IconButton
            aria-owns={this.state.userMenuIsExpanded ? 'menu-list' : null}
            aria-haspopup="true"
            onClick={
              this.state.userMenuIsExpanded ? this.closeMenu : this.openMenu
            }
          >
            <MoreVertIcon />
          </IconButton>
        </Target>
        <Popper
          placement="bottom-start"
          eventsEnabled={this.state.userMenuIsExpanded}
          className={classNames({
            [this.props.classes.popperClose]: !this.state.userMenuIsExpanded,
          })}
        >
          <ClickAwayListener onClickAway={this.closeMenu}>
            <Grow
              in={this.state.userMenuIsExpanded}
              id="menu-list"
              style={{ transformOrigin: '0 0 0' }}
            >
              <Paper>
                <MenuList role="menu">
                  <MenuItem
                    onClick={this.closeMenu}
                    component={Link}
                    to="/profile"
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
                </MenuList>
              </Paper>
            </Grow>
          </ClickAwayListener>
        </Popper>
      </Manager>
    );
  }
}

export default withStyles(styles)(LoggedIn);