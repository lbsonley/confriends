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

  addAttendee() {
    const { sub, nickname } = this.state.profile;
    const userId = sub.substr(sub.length - 6);

    // TODO: improve how this state is updated without mutation
    const newAttendees = this.state.event.attendees.concat({
      userId,
      userName: nickname,
    });
    const newConf = Object.assign({}, this.state.event);
    newConf.attendees = newAttendees;
    const updatedConf = Object.assign({}, this.state.event, newConf);

    this.setState({ event: updatedConf });
  }

  render() {
    return (
      <div>
        {this.state.event.image && <img src={this.state.event.image} alt="" />}
        <h3 className="app-content__header">{this.state.event.name}</h3>
        <p>{this.state.event.location.city}</p>
        <p>{this.state.event.location.country}</p>
        {this.props.auth.isAuthenticated() && (
          <Button onClick={this.addAttendee}>Attend</Button>
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
