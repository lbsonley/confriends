// react core
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// material ui components
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';

// utils
import 'whatwg-fetch';
import bows from 'bows';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: `100%`,
  },
  menu: {
    width: 200,
  },
});

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
      `/api/${this.props.match.params.collectionName}/${
        this.props.match.params.id
      }/edit/${this.props.match.params.userId}`,
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
    console.log('saving info');
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div />
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
          <Button raised color="primary" onClick={this.saveAttendeeInfo}>
            Save
          </Button>
        </form>
      </div>
    );
  }
}

UpdateAttendeeForm.propTypes = {
  classes: PropTypes.shape({
    textField: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(UpdateAttendeeForm);
