// react core
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material ui components
import { withStyles } from 'material-ui/styles';
import { TableCell, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';

// material ui icons
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import DeleteIcon from 'material-ui-icons/Delete';

// my components
import { withContext } from '../../Containers/Provider/Provider';

const styles = {
  centered: {
    textAlign: 'center',
  },
};

const Attendee = props => (
  <TableRow>
    <TableCell>{props.attendee.name}</TableCell>
    <TableCell>{props.attendee.procurementLink}</TableCell>
    <TableCell>{props.attendee.approved}</TableCell>
    <TableCell className={props.classes.centered}>
      <Button
        fab
        color="primary"
        aria-label="edit"
        component={Link}
        to={`/${props.collectionName}/${props.eventId}/edit/${
          props.attendee.id
        }`}
        onClick={this.handleOpen}
      >
        <ModeEditIcon />
      </Button>
    </TableCell>
    <TableCell className={props.classes.centered}>
      <Button fab color="accent" aria-label="delete">
        <DeleteIcon />
      </Button>
    </TableCell>
  </TableRow>
);

Attendee.propTypes = {
  attendee: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    procurementLink: PropTypes.string,
    approved: PropTypes.bool.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    centered: PropTypes.string.isRequired,
  }).isRequired,
  collectionName: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
};

const contextTypes = {
  eventId: PropTypes.string,
  collectionName: PropTypes.string,
};

export default withContext(contextTypes)(withStyles(styles)(Attendee));
