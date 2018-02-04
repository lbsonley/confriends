// react core
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// utilities
import bows from 'bows';
import 'whatwg-fetch';
import classNames from 'classnames';

// material ui components
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Card, { CardActions, CardContent } from 'material-ui/Card';

// my components
import { Provider } from '../Provider/Provider';
import AttendeeList from '../../Components/AttendeeList/AttendeeList';
import PageHeader from '../../Molecules/PageHeader';

import logic from '../../Assets/js/utils/logicHelpers';

const querystring = require('querystring');

class ConferenceDetailsContainer extends Component {
  constructor() {
    super();
    this.state = {
      event: {
        city: '',
        country: '',
        name: '',
        website: '',
      },
      attendees: [],
    };
    this.addUserToEvent = this.addUserToEvent.bind(this);
    this.checkEventsUserList = this.checkEventsUserList.bind(this);
    this.checkUsersEventList = this.checkUsersEventList.bind(this);
    this.validateUserAttend = this.validateUserAttend.bind(this);
    this.removeAttendee = this.removeAttendee.bind(this);

    this.logger = bows('ConferenceDetailsContainer');
  }

  componentDidMount() {
    // fetch the data for single event and store it in state
    fetch(
      `/api/${this.props.match.params.collectionName}/${
        this.props.match.params.id
      }?userId=123&abc=def`,
    )
      .then(response => {
        console.log(response.url);

        const re = /\?(.*)/;
        const queryMatch = re.exec(response.url);
        console.log(queryMatch);
        console.log(querystring.parse(queryMatch[1]));

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

    fetch(`/api/attendees/${this.props.match.params.id}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(data => {
        this.logger('setting new state with: ', data);
        this.setState({
          attendees: data.attendees,
        });
      })
      .catch(err => this.logger('Error fetching attendees:', err));
  }

  /**
   * removeAttendee
   * @description updates state after removing attendee
   */
  removeAttendee = attendees => {
    this.setState({
      attendees,
    });
  };

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
    const { getIdToken, setupUserManagementAPI } = this.props;
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
    const { userId } = this.props.profile;
    const { _id } = this.state.event;
    const { attendees } = this.state;

    if (
      !logic.matchUserId(attendees, userId) &&
      !logic.matchEventId(attendees, _id)
    ) {
      this.logger('adding user to event');
      this.addUserToEvent();
    }
  }

  /**
   * addUserToEvent
   * @description add user to attendee list in event data
   */
  addUserToEvent = () => {
    const { nickname, user_id } = this.props.profile;

    fetch(`/api/attendees/${this.props.match.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: this.props.match.params.id,
        userId: user_id,
        name: nickname,
        procurementLink: '',
        approved: false,
      }),
    })
      .then(res => res.json())
      .then(data => {
        this.logger('setting new state with: ', data);
        this.setState(prevState => ({
          attendees: [
            ...prevState.attendees,
            {
              eventId: data.eventId,
              userId: data.userId,
              name: data.name,
              procurementLink: data.procurementLink,
              approved: data.approved,
            },
          ],
        }));
      })
      .catch(err => this.logger('error adding attendee', err));
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
        <PageHeader title={this.state.event.name} />
        <section className="content">
          <Grid container style={{ padding: 20 }} spacing={40}>
            <Grid item xs={12}>
              <Typography type="headline" gutterBottom>
                Details
              </Typography>
              <Typography type="body1">
                {this.state.event.city}, {this.state.event.country}
              </Typography>
              <Typography type="body1">{this.state.event.date}</Typography>
              <Button
                color="primary"
                type="body1"
                href={this.state.event.website}
                target="_blank"
                className={this.props.classes.link}
              >
                {this.state.event.website}
              </Button>
            </Grid>
            {this.state.event.description ? (
              <Grid item xs={12} style={{ marginTop: 24 }}>
                <Typography type="headline" gutterBottom>
                  Description
                </Typography>
                <Typography
                  type="body1"
                  className={this.props.classes.gutterBottom}
                >
                  {this.state.event.description}
                </Typography>
              </Grid>
            ) : null}
          </Grid>
          <section className={this.props.classes.card}>
            {this.props.isAuthenticated() ? (
              <div>
                <Provider
                  // eslint-disable-next-line no-underscore-dangle
                  eventId={this.state.event._id}
                  collectionName={this.props.match.params.collectionName}
                  isAuthenticated={this.props.isAuthenticated}
                  removeAttendee={this.removeAttendee}
                >
                  <AttendeeList attendees={this.state.attendees} />
                </Provider>
                <Button
                  className={this.props.classes.medium}
                  raised
                  color="primary"
                  onClick={this.validateUserAttend}
                >
                  Attend
                </Button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Typography align="center" type="subheading" gutterBottom>
                  Want to attend this conference?
                </Typography>
                <Button
                  raised
                  className={this.props.classes.big}
                  color="primary"
                  onClick={this.props.onLoginClick}
                >
                  Login to get started
                </Button>
              </div>
            )}
          </section>
        </section>
      </div>
    );
  }
}

const styles = theme => ({
  card: theme.mixins.gutters({
    padding: theme.spacing.unit * 3,
  }),
  button: theme.mixins.gutters({
    marginTop: theme.spacing.unit * 3,
  }),
  gutterBottom: {
    marginBottom: theme.spacing.unit * 5,
  },
  big: {
    padding: 24,
  },
  medium: {
    padding: 16,
  },
  link: {
    marginTop: 0,
    paddingLeft: 0,
    textTransform: 'lowercase',
  },
});

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
  getIdToken: PropTypes.func.isRequired,
  setupUserManagementAPI: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired,
    gutterBottom: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(ConferenceDetailsContainer);
