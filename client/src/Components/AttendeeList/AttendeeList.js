// react core
import React from 'react';
import PropTypes from 'prop-types';

// material ui components
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

// my components
import Attendee from './Attendee';
import { withContext } from '../../Containers/Provider/Provider';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  centered: {
    textAlign: 'center',
  },
});

const AttendeeList = props => {
  this.createListItem = attendee => (
    <Attendee key={attendee.id} attendee={attendee} />
  );

  // return <ul style={listStyle}>{props.attendees.map(this.createListItem)}</ul>;

  return (
    <Paper className={props.classes.root}>
      <Table className={props.classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Attendee Name</TableCell>
            <TableCell>Procurement Link</TableCell>
            <TableCell>Approved {props.eventId}</TableCell>
            <TableCell className={props.classes.centered}>Edit</TableCell>
            <TableCell className={props.classes.centered}>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{props.attendees.map(this.createListItem)}</TableBody>
      </Table>
    </Paper>
  );
};

AttendeeList.propTypes = {
  attendees: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const contextTypes = {
  eventId: PropTypes.string,
};

export default withContext(contextTypes)(withStyles(styles)(AttendeeList));
