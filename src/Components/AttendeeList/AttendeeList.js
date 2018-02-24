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

const AttendeeList = ({ classes, isAuthenticated, attendees }) => {
  this.createListItem = attendee => (
    <Attendee key={attendee.userId} attendee={attendee} />
  );

  return (
    <div>
      <Typography variant="headline">Attendee List</Typography>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Attendee Name</TableCell>
              <TableCell>Procurement Ticket</TableCell>
              <TableCell className={classes.centered}>Approved</TableCell>
              {isAuthenticated() ? (
                <TableCell className={classes.centered}>Edit</TableCell>
              ) : null}
              {isAuthenticated() ? (
                <TableCell className={classes.centered}>Delete</TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {attendees.length ? (
              attendees.map(this.createListItem)
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
  isAuthenticated: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    table: PropTypes.string.isRequired,
    centered: PropTypes.string.isRequired,
  }).isRequired,
};

const contextTypes = {
  isAuthenticated: PropTypes.func,
};

export default withContext(contextTypes)(withStyles(styles)(AttendeeList));
