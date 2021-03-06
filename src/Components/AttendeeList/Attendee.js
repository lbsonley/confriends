// react core
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// utilities
import bows from 'bows';
import classNames from 'classnames';

// material ui components
import { withStyles } from 'material-ui/styles';
import { TableCell, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';

// material ui icons
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import DeleteIcon from 'material-ui-icons/Delete';
import NotInterested from 'material-ui-icons/NotInterested';
import Check from 'material-ui-icons/Check';

// utils
import fetchHelpers from '../../Assets/js/utils/fetchHelpers';

// my components
import { withContext } from '../../Containers/Provider/Provider';

const styles = theme => ({
  centered: {
    textAlign: 'center',
  },
  statusIcon: {
    height: 64,
    width: 64,
    verticalAlign: 'middle',
  },
  unapproved: {
    color: theme.palette.secondary.main,
  },
  approved: {
    color: theme.palette.primary.main,
  },
});

class Attendee extends Component {
  logger = bows('Attendee');

  handleDelete = () => {
    const { eventId, attendee, removeAttendee } = this.props;
    this.logger('deleting');
    fetch(`/api/v1/attendees/${attendee.eventId}/${attendee.userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        userId: attendee.userId,
      }),
    })
      .then(fetchHelpers.validateResponse)
      .then(fetchHelpers.parseJSON)
      .then(data => {
        this.logger('setting new state with: ', data);
        removeAttendee(data.attendees);
      })
      .catch(err => this.logger('error fetching attendees:', err));
  };

  render() {
    const {
      attendee,
      classes,
      isAuthenticated,
      collectionName,
      eventId,
    } = this.props;
    return (
      <TableRow>
        <TableCell>{attendee.name}</TableCell>
        <TableCell>
          {attendee.procurementLink ? (
            <a href={attendee.procurementLink} target="_blank">
              {attendee.procurementLink}
            </a>
          ) : null}
        </TableCell>
        <TableCell className={classes.centered}>
          {attendee.approved ? (
            <Check
              className={classNames({
                [classes.statusIcon]: true,
                [classes.approved]: true,
              })}
            />
          ) : (
            <NotInterested
              className={classNames({
                [classes.statusIcon]: true,
                [classes.unapproved]: true,
              })}
            />
          )}
        </TableCell>
        {isAuthenticated() ? (
          <TableCell className={classes.centered}>
            <Button
              variant="fab"
              color="primary"
              aria-label="edit"
              component={Link}
              to={`/edit/${collectionName}/${eventId}/${attendee.userId}`}
            >
              <ModeEditIcon />
            </Button>
          </TableCell>
        ) : null}
        {isAuthenticated() ? (
          <TableCell className={classes.centered}>
            <Button
              variant="fab"
              color="secondary"
              aria-label="delete"
              onClick={this.handleDelete}
            >
              <DeleteIcon />
            </Button>
          </TableCell>
        ) : null}
      </TableRow>
    );
  }
}

Attendee.propTypes = {
  attendee: PropTypes.shape({
    eventId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    procurementLink: PropTypes.string,
    approved: PropTypes.bool.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    centered: PropTypes.string.isRequired,
    statusIcon: PropTypes.string.isRequired,
  }).isRequired,
  eventId: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
  removeAttendee: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
};

const contextTypes = {
  eventId: PropTypes.string,
  collectionName: PropTypes.string,
  isAuthenticated: PropTypes.func,
  removeAttendee: PropTypes.func,
};

export default withContext(contextTypes)(withStyles(styles)(Attendee));
