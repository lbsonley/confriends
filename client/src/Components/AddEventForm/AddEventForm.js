/**
 * AddEventForm.js
 * @description - form to add event
 * @author - Ben Sonley
 */

// react core
import React, { Component } from 'react';

// utitlies
import bows from 'bows';

// material ui components
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import { FormControlLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

class AddEventForm extends Component {
  state = {
    name: '',
    city: '',
    country: '',
    date: '',
    website: '',
    description: '',
  };

  logger = bows('AddEventForm');

  saveEvent = () => {
    const { name, city, country, date, website, description } = this.state;
    fetch(`/api/conferences/add`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        website,
        date,
        city,
        country,
        description,
      }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(data => {
        this.logger('setting new state with: ', data);
        this.setState({
          name: data.name,
          website: data.website,
          date: data.date,
          city: data.city,
          country: data.country,
          description: data.description,
        });
      })
      .catch(err => this.logger('Error fetching attendees:', err));
  };

  handleTextInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <form noValidate autoComplete="off">
          <Grid container style={{ padding: 20 }} spacing={24}>
            <Grid item xs={12}>
              <Typography type="headline">Add Event</Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                id="name"
                name="name"
                label="Event Name"
                className={classes.textField}
                value={this.state.name}
                onChange={this.handleTextInputChange}
                margin="none"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="date"
                name="date"
                label="Date"
                className={classes.textField}
                value={this.state.date}
                onChange={this.handleTextInputChange}
                margin="none"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="city"
                name="city"
                label="City"
                className={classes.textField}
                value={this.state.city}
                onChange={this.handleTextInputChange}
                margin="none"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="country"
                name="country"
                label="Country"
                className={classes.textField}
                value={this.state.country}
                onChange={this.handleTextInputChange}
                margin="none"
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="website"
                name="website"
                label="Website"
                className={classes.textField}
                value={this.state.website}
                onChange={this.handleTextInputChange}
                margin="none"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="description"
                name="description"
                label="Description"
                className={classes.textField}
                value={this.state.description}
                onChange={this.handleTextInputChange}
                margin="none"
              />
            </Grid>
            <Grid style={{ textAlign: 'right' }} item xs={12}>
              <Button raised color="primary" onClick={this.saveEvent}>
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
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
    width: 800,
  }),
  textField: {
    width: `100%`,
  },
  menu: {
    width: 200,
  },
});

export default withStyles(styles)(AddEventForm);
