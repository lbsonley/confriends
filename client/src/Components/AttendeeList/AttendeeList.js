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

const Attendee = props => (
  <TableRow>
    <TableCell>{props.attendee.name}</TableCell>
    <TableCell>{props.attendee.procurementLink}</TableCell>
    <TableCell>{props.attendee.approved}</TableCell>
  </TableRow>
);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const AttendeeList = props => {
  const listStyle = {
    listStyleType: 'none',
    paddingLeft: 0,
    margin: 0,
  };

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
            <TableCell>Approved</TableCell>
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

Attendee.propTypes = {
  attendee: PropTypes.shape({
    name: PropTypes.string.isRequired,
    procurementLink: PropTypes.string,
    approved: PropTypes.bool.isRequired,
  }),
};

export default withStyles(styles)(AttendeeList);
