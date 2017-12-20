import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bows from 'bows';
import 'whatwg-fetch';

import AttendeeList from '../Components/AttendeeList/AttendeeList';
import Button from '../Components/Button/Button';

export default class ConferenceDetailsContainer extends Component {
  constructor() {
    super();
    this.state = {
      event: {
        location: {
          city: '',
          country: '',
        },
        attendees: [],
      },
    };
    this.addAttendee = this.addAttendee.bind(this);
    this.checkAttendeeList = this.checkAttendeeList.bind(this);
    this.logger = bows('ConferenceDetailsContainer');
  }

  componentDidMount() {
    fetch(
      `/api/${this.props.match.params.collectionName}/${
        this.props.match.params.id
      }`,
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(data => {
        this.logger('setting new State with: ', data);
        this.setState({ event: data.event }); // eslint-disable-line react/no-did-mount-set-state
      })
      .catch(err => this.logger(err));

    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile }); // eslint-disable-line react/no-did-mount-set-state
      });
    } else {
      this.setState({ profile: userProfile }); // eslint-disable-line react/no-did-mount-set-state
    }

    this.logger('componentDidMount');
  }

  checkAttendeeList() {
    const { sub, nickname } = this.state.profile;
    const userId = sub.substr(sub.length - 6);

    // check if an attendee list exists for this event
    if (this.state.event.attendees && this.state.event.attendees.length > 0) {
      // check if user is already on attendee list
      if (
        !this.state.event.attendees.find(attendee => attendee.id === userId)
      ) {
        this.addAttendee(userId, nickname);
      }
    } else {
      // start an attendee list for this event
      this.addAttendee(userId, nickname);
    }
  }

  addAttendee(userId, nickname) {
    fetch(`/api${this.props.location.pathname}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, name: nickname }),
    })
      .then(res => res.json())
      .then(data => {
        this.setState(prevState => ({
          event: {
            ...prevState.event,
            attendees: data.attendees,
          },
        }));
        console.log(data);
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <h3 className="app-content__header">{this.state.event.name}</h3>
        <p>{this.state.event.location.city}</p>
        <p>{this.state.event.location.country}</p>
        {this.props.auth.isAuthenticated() && (
          <Button onClick={this.checkAttendeeList}>Attend</Button>
        )}
        {this.state.event.attendees && (
          <AttendeeList attendees={this.state.event.attendees} />
        )}
      </div>
    );
  }
}

ConferenceDetailsContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      collectionName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  auth: PropTypes.shape({
    userProfile: PropTypes.object,
    getProfile: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.func.isRequired,
  }).isRequired,
};
