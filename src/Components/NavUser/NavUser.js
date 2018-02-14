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
  popperOpen: {
    zIndex: 1,
  },
};

class LoggedIn extends Component {
  state = {
    userMenuIsExpanded: false,
  };

  openMenu = () => {
    this.setState({ userMenuIsExpanded: true });
  };

  closeMenu = () => {
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
            <MoreVertIcon style={{ fill: '#fff' }} />
          </IconButton>
        </Target>
        <Popper
          placement="bottom-end"
          eventsEnabled={this.state.userMenuIsExpanded}
          className={classNames({
            [this.props.classes.popperClose]: !this.state.userMenuIsExpanded,
            [this.props.classes.popperOpen]: this.state.userMenuIsExpanded,
          })}
        >
          <ClickAwayListener onClickAway={this.closeMenu}>
            <Grow
              in={this.state.userMenuIsExpanded}
              id="menu-list"
              style={{ transformOrigin: 'right top 0' }}
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

LoggedIn.propTypes = {
  onLogoutClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(LoggedIn);
