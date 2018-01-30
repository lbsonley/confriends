// react core
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// utilities
import bows from 'bows';

// material ui components
import { withStyles } from 'material-ui/styles';
import { TableCell, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';

// material ui icons
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import DeleteIcon from 'material-ui-icons/Delete';
import Warning from 'material-ui-icons/Warning';
import Check from 'material-ui-icons/Check';

// my components
import { withContext } from '../../Containers/Provider/Provider';

const styles = {
  centered: {
    textAlign: 'center',
  },
};

class Attendee extends Component {
  logger = bows('Attendee');

  handleDelete = () => {
    const { eventId, attendee, removeAttendee } = this.props;
    this.logger('deleting');
    fetch(`/api/attendees/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        userId: attendee.userId,
      }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(data => {
        this.logger('setting new state with: ', data);
        removeAttendee(data.attendees);
      })
      .catch(err => this.logger('error fetching attendees:', err));
  };

  render() {
    const { props } = this;
    return (
      <TableRow>
        <TableCell>{props.attendee.name}</TableCell>
        <TableCell>{props.attendee.procurementLink}</TableCell>
        <TableCell className={props.classes.centered}>
          {props.attendee.approved ? (
            <Check
              color="error"
              style={{ height: 56, width: 56, fill: 'green' }}
            />
          ) : (
            <Warning style={{ height: 56, width: 56, fill: '#fede3b' }} />
          )}
        </TableCell>
        {props.isAuthenticated() ? (
          <TableCell className={props.classes.centered}>
            <Button
              fab
              color="primary"
              aria-label="edit"
              component={Link}
              to={`/${props.collectionName}/${props.eventId}/edit/${
                props.attendee.userId
              }`}
            >
              <ModeEditIcon />
            </Button>
          </TableCell>
        ) : null}
        {props.isAuthenticated() ? (
          <TableCell className={props.classes.centered}>
            <Button
              fab
              color="accent"
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
  }).isRequired,
  collectionName: PropTypes.string.isRequired,
};

const contextTypes = {
  eventId: PropTypes.string,
  collectionName: PropTypes.string,
  isAuthenticated: PropTypes.func,
  removeAttendee: PropTypes.func,
};

export default withContext(contextTypes)(withStyles(styles)(Attendee));
