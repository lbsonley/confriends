import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bows from 'bows';
import 'whatwg-fetch';

import Button from 'material-ui/Button';
import { Provider } from '../Provider/Provider';
import AttendeeList from '../../Components/AttendeeList/AttendeeList';

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
  }

  /**
   * checkArray
   * @description check array for presence of item and execute callback
   * @param {Array} array - array to be checked
   * @param {String} value - item to look for in array
   * @param {func} cb - function to execute if value is found
   */
  checkArray = ({ array, value, cb }) => {
    // check if array has entries
    if (array && array.length > 0) {
      // check if value is present in array
      if (!logic.arrayHasValue(array, value)) {
        // add value to array
        cb();
      }
    } else {
      cb();
    }
  };

  /**
   * checkUsersEventList
   * @description check if event is already in a user's event list
   */
  checkUsersEventList() {
    const { user_metadata } = this.props.profile;
    const { _id } = this.state.event;

    this.checkArray({
      array: user_metadata.events,
      value: _id,
      cb: this.addEventToUser,
    });
  }

  /**
   * addEventToUser
   * @description add event to event list in user profile
   */
  addEventToUser = () => {
    const { user_metadata, user_id } = this.props.profile;
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
  };

  /**
   * checkEventsUserList
   * @description check if user is already present on event's attendee list
   */
  checkEventsUserList() {
    const { user_id } = this.props.profile;
    const { attendees } = this.state.event;

    this.checkArray({
      array: attendees,
      value: user_id,
      cb: this.addUserToEvent,
    });
  }

  /**
   * addUserToEvent
   * @description add user to attendee list in event data
   */
  addUserToEvent = () => {
    const { nickname, user_id } = this.props.profile;

    fetch(`/api${this.props.location.pathname}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user_id,
        name: nickname,
        procurementLink: '',
        approved: false,
      }),
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
  };

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
          <Button raised color="primary" onClick={this.validateUserAttend}>
            Attend
          </Button>
        )}
        {this.state.event.attendees && (
          // eslint-disable-next-line no-underscore-dangle
          <Provider eventId={this.state.event._id}>
            <AttendeeList attendees={this.state.event.attendees} />
          </Provider>
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
  profile: PropTypes.shape({
    user_id: PropTypes.string,
    nickname: PropTypes.string,
    user_metadata: PropTypes.shape({
      events: PropTypes.array,
    }),
  }).isRequired,
  auth: PropTypes.shape({
    getIdToken: PropTypes.func.isRequired,
    setupUserManagementAPI: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.func.isRequired,
  }).isRequired,
};
