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
import Typography from 'material-ui/Typography';

// my components and utils
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
    <Attendee key={attendee.userId} attendee={attendee} />
  );

  // return <ul style={listStyle}>{props.attendees.map(this.createListItem)}</ul>;

  return (
    <div>
      <Typography type="headline">Attendee List</Typography>
      <Paper className={props.classes.root}>
        <Table className={props.classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Attendee Name</TableCell>
              <TableCell>Procurement Ticket</TableCell>
              <TableCell className={props.classes.centered}>Approved</TableCell>
              {props.isAuthenticated() ? (
                <TableCell className={props.classes.centered}>Edit</TableCell>
              ) : null}
              {props.isAuthenticated() ? (
                <TableCell className={props.classes.centered}>Delete</TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.attendees.length ? (
              props.attendees.map(this.createListItem)
            ) : (
              <TableRow>
                <TableCell>No attendees registered</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

AttendeeList.propTypes = {
  attendees: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const contextTypes = {
  isAuthenticated: PropTypes.func,
};

export default withContext(contextTypes)(withStyles(styles)(AttendeeList));
