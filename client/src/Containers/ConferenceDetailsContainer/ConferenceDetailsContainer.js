import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bows from 'bows';
import 'whatwg-fetch';

import AttendeeList from '../../Components/AttendeeList/AttendeeList';
import Button from '../../Components/Button/Button';

import logic from '../../Assets/js/utils/logicHelpers';

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
    this.addUserToEvent = this.addUserToEvent.bind(this);
    this.checkEventsUserList = this.checkEventsUserList.bind(this);
    this.checkUsersEventList = this.checkUsersEventList.bind(this);
    this.validateUserAttend = this.validateUserAttend.bind(this);

    this.logger = bows('ConferenceDetailsContainer');
  }

  componentDidMount() {
    // fetch the data for single event and store it in state
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

    // fetch user profile and store it in state
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

  /**
   * checkUsersEventList
   * @description check if event is already in a user's event list
   */
  checkUsersEventList() {
    const { user_metadata } = this.state.profile;
    const { _id } = this.state.event;

    if (user_metadata.events && user_metadata.events.length > 0) {
      // check if event is already in user's list
      if (!logic.arrayHasValue(user_metadata.events, _id)) {
        this.addEventToUser();
      }
    } else {
      this.addEventToUser();
    }
  }

  /**
   * checkEventsUserList
   * @description check if user is already present on event's attendee list
   */
  checkEventsUserList() {
    const { user_id, nickname } = this.state.profile;
    const { attendees } = this.state.event;

    // check if an attendee list exists for this event
    if (attendees && attendees.length > 0) {
      // check if user is already on attendee list
      if (!logic.arrayHasValue(attendees, user_id)) {
        this.addUserToEvent(user_id, nickname);
      }
    } else {
      // start an attendee list for this event
      this.addUserToEvent(user_id, nickname);
    }
  }

  /**
   * addEventToUser
   * @description add event to event list in user profile
   */
  addEventToUser() {
    const { user_metadata, user_id } = this.state.profile;
    const { name, _id } = this.state.event;
    const { getIdToken, setupUserManagementAPI } = this.props.auth;
    const idToken = getIdToken();
    const auth0Manage = setupUserManagementAPI(idToken);
    const updatedEvents = user_metadata.events || [];

    updatedEvents.push({
      title: name,
      // eslint-disable-next-line no-underscore-dangle
      id: _id,
    });

    auth0Manage.patchUserMetadata(
      user_id,
      { events: updatedEvents },
      (err, data) => this.logger(err, data),
    );
  }

  /**
   * addUserToEvent
   * @description add user to attendee list in event data
   * @param {String} userId user id
   * @param {String} nickname user name
   */
  addUserToEvent(userId, nickname) {
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
        this.logger(data);
      })
      .catch(err => this.logger(err));
  }

  /**
   * validateUserAttend
   * @description calls check functions to determine is user is already attending event
   */
  validateUserAttend() {
    this.checkEventsUserList();
    this.checkUsersEventList();
  }

  render() {
    return (
      <div>
        <h3 className="app-content__header">{this.state.event.name}</h3>
        <p>{this.state.event.location.city}</p>
        <p>{this.state.event.location.country}</p>
        {this.props.auth.isAuthenticated() && (
          <Button onClick={this.validateUserAttend}>Attend</Button>
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