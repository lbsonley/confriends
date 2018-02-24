// react core
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// material ui components
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';

// utils
import 'whatwg-fetch';
import bows from 'bows';

// my components
import PageHeader from '../../Molecules/PageHeader';
import LinkButton from '../Button/LinkButton';

import history from '../../Assets/js/utils/history';
import fetchHelpers from '../../Assets/js/utils/fetchHelpers';

class UpdateAttendeeForm extends Component {
  // using props to set initial state because edit form
  // is re-mounted every time the overlay opens
  state = {
    name: '',
    userId: '',
    procurementLink: '',
    approved: false,
    invalidFields: {},
  };

  componentDidMount() {
    const { match } = this.props;
    fetch(`/api/v1/attendees/${match.params.id}/${match.params.userId}`)
      .then(fetchHelpers.validateResponse)
      .then(fetchHelpers.parseJSON)
      .then(data => {
        this.logger('setting new State with: ', data);
        this.setState({ ...data.attendee });
      })
      .catch(err => this.logger(err));
  }

  logger = bows('UpdateAttendeeForm');

  handleTextInputChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });

    this.validateUrl(name, value).then(invalidFields => {
      this.setState({ invalidFields });
    });
  };

  handleSwitchInputChange = (e, checked) => {
    this.setState({
      [e.target.name]: checked,
    });
  };

  validateUrl = (name, value) => {
    const invalidFields = Object.assign({}, this.state.invalidFields);
    const valid = /^http[s]?:\/\/jira\.unic\.com\/browse\/PROCH-\d+$/.test(
      value,
    );
    return new Promise(resolve => {
      if (!valid) {
        invalidFields[name] = true;
      } else {
        delete invalidFields[name];
      }
      resolve(invalidFields);
    });
  };

  saveAttendeeInfo = e => {
    const { eventId, userId, name, procurementLink, approved } = this.state;
    const { match } = this.props;
    e.preventDefault();

    this.validateUrl('procurementLink', procurementLink).then(invalidFields => {
      this.setState({ invalidFields });
      if (Object.keys(invalidFields).length === 0) {
        fetch(`/api/v1/attendees/${match.params.id}/${match.params.userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId,
            userId,
            name,
            procurementLink,
            approved,
          }),
        })
          .then(fetchHelpers.validateResponse)
          .then(fetchHelpers.parseJSON)
          .then(data => {
            this.logger('setting new state with: ', data);
            this.setState({
              eventId: data.eventId,
              userId: data.userId,
              name: data.name,
              procurementLink: data.procurementLink,
              approved: data.approved,
            });
            history.push(`/${match.params.collectionName}/${match.params.id}`);
          })
          .catch(err => this.logger(err));
      }
    });
  };

  render() {
    const { classes, match } = this.props;

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
              error={this.state.invalidFields.procurementLink}
              helperText={
                this.state.invalidFields.procurementLink
                  ? 'Please enter a valid procumrent ticket URL'
                  : null
              }
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
              type="submit"
              onClick={this.saveAttendeeInfo}
            >
              Save
            </Button>
            <LinkButton
              href={`/conferences/${match.params.id}`}
              inlineStyles={{ marginLeft: 20 }}
            >
              Cancel
            </LinkButton>
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default withStyles(styles)(UpdateAttendeeForm);
