import React from 'react';
import PropTypes from 'prop-types';

const Attendee = props => <li>{props.name}</li>;

const AttendeeList = props => {
  const listStyle = {
    listStyleType: 'none',
    paddingLeft: 0,
    margin: 0,
  };

  this.createListItem = attendee => (
    <Attendee key={attendee.userId} name={attendee.userName} />
  );

  return <ul style={listStyle}>{props.attendees.map(this.createListItem)}</ul>;
};

AttendeeList.propTypes = {
  attendees: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Attendee.propTypes = {
  name: PropTypes.string.isRequired,
};

export default AttendeeList;
