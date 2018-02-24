// react core
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// utilities
import bows from 'bows';
import 'whatwg-fetch';

// material ui components
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

// my components
import { Provider } from '../Provider/Provider';
import AttendeeList from '../../Components/AttendeeList/AttendeeList';
import PageHeader from '../../Molecules/PageHeader';
import LinkButton from '../../Components/Button/LinkButton';

import logic from '../../Assets/js/utils/logicHelpers';
import fetchHelpers from '../../Assets/js/utils/fetchHelpers';
import history from '../../Assets/js/utils/history';

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
    this.validateUserAttend = this.validateUserAttend.bind(this);
    this.removeAttendee = this.removeAttendee.bind(this);
    this.handleDeleteEvent = this.handleDeleteEvent.bind(this);

    this.logger = bows('ConferenceDetailsContainer');
  }

  componentDidMount() {
    // fetch the data for single event and store it in state
    fetch(
      `/api/v1/${this.props.match.params.collectionName}/${
        this.props.match.params.id
      }?userId=123&abc=def`,
    )
      .then(response => {
        this.logger(response.url);

        const re = /\?(.*)/;
        const queryMatch = re.exec(response.url);
        this.logger(queryMatch);
        this.logger(querystring.parse(queryMatch[1]));
        return response;
      })
      .then(fetchHelpers.validateResponse)
      .then(fetchHelpers.parseJSON)
      .then(data => {
        this.logger('setting new State with: ', data);
        this.setState({ event: data.event });
      })
      .catch(err => this.logger(err));

    fetch(`/api/v1/attendees/${this.props.match.params.id}`)
      .then(fetchHelpers.validateResponse)
      .then(fetchHelpers.parseJSON)
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
   * checkEventsUserList
   * @description check if user is already present on event's attendee list
   */
  checkEventsUserList() {
    const { user_id } = this.props.profile;
    const { _id } = this.state.event;
    const { attendees } = this.state;
    if (!logic.matchEventAndUserId(attendees, _id, user_id)) {
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

    fetch(`/api/v1/attendees/${this.props.match.params.id}`, {
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
      .then(fetchHelpers.validateResponse)
      .then(fetchHelpers.parseJSON)
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
  }

  /**
   * handleDeleteEvent
   * @description send delete operation to server to remove event and it's attendees
   */
  handleDeleteEvent() {
    // eslint-disable-next-line no-underscore-dangle
    fetch(`/api/v1/attendees/${this.state.event._id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(fetchHelpers.validateResponse)
      .then(fetchHelpers.parseJSON)
      .then(data => this.logger(data))
      .catch(err => this.logger(err));

    // eslint-disable-next-line no-underscore-dangle
    fetch(`/api/v1/conferences/${this.state.event._id}`, {
      method: 'DELETE',
      header: { 'Content-Type': 'application/json' },
    })
      .then(fetchHelpers.validateResponse)
      .then(fetchHelpers.parseJSON)
      .then(data => this.logger(data))
      .catch(err => this.logger(err));

    history.push('/conferences');
  }

  render() {
    return (
      <div>
        <PageHeader title={this.state.event.name} />
        <section className="content">
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="headline" gutterBottom>
                Details
              </Typography>
              <Typography variant="body1">
                {this.state.event.city}, {this.state.event.country}
              </Typography>
              <Typography variant="body1">{this.state.event.date}</Typography>
              <LinkButton
                href={this.state.event.website}
                target="_blank"
                inlineStyles={{ textTransform: 'lowercase' }}
              >
                {this.state.event.website}
              </LinkButton>
            </Grid>
            {this.state.event.description ? (
              <Grid item xs={12}>
                <Typography variant="headline" gutterBottom>
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  // className={this.props.classes.gutterBottom}
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
                  variant="raised"
                  color="primary"
                  onClick={this.validateUserAttend}
                >
                  Attend
                </Button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Typography align="center" variant="subheading" gutterBottom>
                  Want to attend this conference?
                </Typography>
                <Button
                  variant="raised"
                  className={this.props.classes.big}
                  color="primary"
                  onClick={this.props.onLoginClick}
                >
                  Login to get started
                </Button>
              </div>
            )}
          </section>
          {this.props.isAuthenticated() ? (
            <Grid container style={{ marginTop: 80 }}>
              <Grid
                item
                xs={12}
                style={{
                  borderWidth: 2,
                  borderColor: '#F2453D',
                  borderStyle: 'solid',
                  marginBottom: 16,
                }}
              >
                <Typography variant="headline" color="error">
                  Danger Zone
                </Typography>
                <Typography variant="subheading" color="error">
                  By deleting this event you will lose all data related to it.
                </Typography>
                <Button
                  variant="raised"
                  color="secondary"
                  onClick={this.handleDeleteEvent}
                >
                  Delete event
                </Button>
              </Grid>
            </Grid>
          ) : null}
        </section>
      </div>
    );
  }
}

const styles = theme => ({
  card: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
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
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
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
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired,
    gutterBottom: PropTypes.string.isRequired,
    medium: PropTypes.string.isRequired,
    big: PropTypes.string.isRequired,
  }).isRequired,
  isAuthenticated: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(ConferenceDetailsContainer);
