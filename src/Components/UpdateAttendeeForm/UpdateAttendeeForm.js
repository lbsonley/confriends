// react core
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// material ui components
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

// utils
import 'whatwg-fetch';
import bows from 'bows';

// my components
import PageHeader from '../../Molecules/PageHeader';

import history from '../../Assets/js/utils/history';

class UpdateAttendeeForm extends Component {
  // using props to set initial state because edit form
  // is re-mounted every time the overlay opens
  state = {
    name: '',
    id: '',
    procurementLink: '',
    approved: false,
  };

  componentDidMount() {
    fetch(
      `/api/attendees/${this.props.match.params.id}/${
        this.props.match.params.userId
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
        this.setState({ ...data.attendee }); // eslint-disable-line react/no-did-mount-set-state
      })
      .catch(err => this.logger(err));
  }

  logger = bows('UpdateAttendeeForm');

  handleTextInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSwitchInputChange = (e, checked) => {
    this.setState({
      [e.target.name]: checked,
    });
  };

  saveAttendeeInfo = () => {
    const { eventId, userId, name, procurementLink, approved } = this.state;
    fetch(
      `/api/attendees/${this.props.match.params.id}/${
        this.props.match.params.userId
      }`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          userId,
          name,
          procurementLink,
          approved,
        }),
      },
    )
      .then(res => res.json())
      .then(data => {
        this.logger('setting new state with: ', data);
        this.setState(prevState => ({
          eventId: data.eventId,
          userId: data.userId,
          name: data.name,
          procurementLink: data.procurementLink,
          approved: data.approved,
        }));
        history.push(
          `/${this.props.match.params.collectionName}/${
            this.props.match.params.id
          }`,
        );
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <PageHeader title="Update Attendee Info" />
        <Paper className={classes.paper}>
          <form noValidate autoComplete="off">
            <TextField
              disabled
              id="name"
              name="name"
              className={classes.textField}
              value={this.state.name}
              margin="normal"
            />
            <TextField
              id="procurementLink"
              name="procurementLink"
              label="Procurement Link"
              className={classes.textField}
              value={this.state.procurementLink}
              onChange={this.handleTextInputChange}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Switch
                  name="approved"
                  checked={this.state.approved}
                  onChange={this.handleSwitchInputChange}
                />
              }
              label="Approved"
            />
            <Button
              variant="raised"
              color="primary"
              onClick={this.saveAttendeeInfo}
            >
              Save
            </Button>
          </form>
        </Paper>
      </div>
    );
  }
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: theme.mixins.gutters({
    padding: 24,
    // paddingBottom: 24,
    marginTop: theme.spacing.unit * 3,
    marginRight: 'auto',
    marginLeft: 'auto',
    width: 400,
  }),
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: `100%`,
  },
  menu: {
    width: 200,
  },
});

UpdateAttendeeForm.propTypes = {
  classes: PropTypes.shape({
    textField: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(UpdateAttendeeForm);
