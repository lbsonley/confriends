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
import Button from 'material-ui/Button';

// my utils
import history from '../../Assets/js/utils/history';
import fetchHelpers from '../../Assets/js/utils/fetchHelpers';

// my components
import PageHeader from '../../Molecules/PageHeader';

class AddEventForm extends Component {
  state = {
    name: '',
    city: '',
    country: '',
    date: '',
    website: '',
    description: '',
    invalidFields: {},
  };

  componentDidMount() {
    const { match } = this.props;
    if (match.params.collectionName && match.params.id) {
      this.logger('you should fetch the conference to edit');
      fetch(
        `/api/v1/${this.props.match.params.collectionName}/${
          this.props.match.params.id
        }`,
      )
        .then(fetchHelpers.validateResponse)
        .then(fetchHelpers.parseJSON)
        .then(data => {
          this.logger('setting new State with: ', { ...data.event });
          this.setState({ ...data.event }); // eslint-disable-line react/no-did-mount-set-state
        })
        .catch(err => this.logger(err));
    } else {
      this.setDefaultDate();
    }
  }

  setDefaultDate = () => {
    const date = new Date().toISOString();
    const matches = /(^[0-9-]*)/.exec(date);
    this.setState({ date: matches[0] });
  };

  logger = bows('AddEventForm');

  validateField = (name, value) => {
    let valid = false;

    const textOnlyRe = /[a-zA-Z0-9\s]+$/;
    const anyNonWhiteSpaceChar = /\S+/;
    const websiteRe = /^https?:\/\/(?:[w]{3}\.)?[a-zA-Z0-9]*(?:\.com|\.org|\.net|\.io|\.ch|\.de)[a-zA-Z0-9/]*$/;
    const dateRe = /\d{4}-\d{2}-\d{2}/;

    return new Promise((resolve, reject) => {
      switch (name) {
        case 'name':
        case 'city':
        case 'country':
          valid = textOnlyRe.test(value);
          break;
        case 'website':
          valid = websiteRe.test(value);
          break;
        case 'date':
          // only ####/##/##
          valid = dateRe.test(value);
          break;
        case 'description':
          valid = anyNonWhiteSpaceChar.test(value);
          break;
        default:
          valid = true;
          this.logger('There was no matching input to validate', name, value);
          break;
      }

      resolve({ [name]: valid });
    });
  };

  validateFields = inputs =>
    new Promise((resolve, reject) => {
      const promises = Object.keys(inputs).map(input =>
        this.validateField(input, inputs[input]),
      );

      Promise.all(promises).then(values => {
        resolve(values);
      });
    });

  handleTextInputChange = e => {
    const { name, value } = e.target;

    this.validateField(name, value).then(obj => {
      const invalidFields = Object.assign({}, this.state.invalidFields);

      Object.keys(obj).forEach(field => {
        if (obj[field]) {
          delete invalidFields[field];
        } else {
          invalidFields[field] = true;
        }
      });

      this.setState({
        [name]: value,
        invalidFields,
      });
    });
  };

  saveEvent = e => {
    e.preventDefault();

    const { name, city, country, date, website, description } = this.state;
    const inputs = {};
    const invalidFields = {};

    Object.keys(this.state).forEach(item => {
      if (item !== 'invalidFields') {
        inputs[item] = this.state[item];
      }
    });

    this.validateFields(inputs)
      .then(valuesArray =>
        // convert array of objects into single object
        valuesArray.reduce((obj, item) => Object.assign({}, obj, item), {}),
      )
      .then(obj => {
        Object.keys(obj).forEach(field => {
          // if field did not pass validation
          // add it to the invalid fields obj
          if (!obj[field]) {
            invalidFields[field] = true;
          }
        });
        this.setState({ invalidFields });
        return invalidFields;
      })
      .then(invalids => {
        if (Object.keys(invalids).length === 0) {
          fetch(`/api/v1/conferences`, {
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
            .then(fetchHelpers.validateResponse)
            .then(fetchHelpers.parseJSON)
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
              history.push(`/conferences/${data._id}`); // eslint-disable-line no-underscore-dangle
            })
            .catch(err => this.logger('Error fetching attendees:', err));
        }
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <PageHeader title="Add Event" />
        <section className="content">
          <form noValidate autoComplete="off">
            <Grid container>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="Event Name"
                  className={classes.textField}
                  value={this.state.name}
                  onChange={this.handleTextInputChange}
                  margin="none"
                  error={this.state.invalidFields.name}
                  helperText={
                    this.state.invalidFields.name
                      ? 'Please enter a valid event name'
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="date"
                  name="date"
                  label="Date"
                  type="date"
                  className={classes.textField}
                  value={this.state.date}
                  onChange={this.handleTextInputChange}
                  margin="none"
                  error={this.state.invalidFields.date}
                  helperText={
                    this.state.invalidFields.date
                      ? 'Please enter a valid event date'
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="city"
                  name="city"
                  label="City"
                  className={classes.textField}
                  value={this.state.city}
                  onChange={this.handleTextInputChange}
                  margin="none"
                  error={this.state.invalidFields.city}
                  helperText={
                    this.state.invalidFields.city
                      ? 'Please enter a valid event city'
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="country"
                  name="country"
                  label="Country"
                  className={classes.textField}
                  value={this.state.country}
                  onChange={this.handleTextInputChange}
                  margin="none"
                  error={this.state.invalidFields.country}
                  helperText={
                    this.state.invalidFields.country
                      ? 'Please enter a valid event country'
                      : null
                  }
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  required
                  id="website"
                  name="website"
                  label="Website"
                  className={classes.textField}
                  value={this.state.website}
                  onChange={this.handleTextInputChange}
                  margin="none"
                  error={this.state.invalidFields.website}
                  helperText={
                    this.state.invalidFields.website
                      ? 'Please enter a valid event website'
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="description"
                  name="description"
                  label="Description"
                  className={classes.textField}
                  value={this.state.description}
                  onChange={this.handleTextInputChange}
                  margin="none"
                  error={this.state.invalidFields.description}
                  helperText={
                    this.state.invalidFields.description
                      ? 'Please enter a valid event description'
                      : null
                  }
                />
              </Grid>
              <Grid style={{ textAlign: 'right' }} item xs={12}>
                <Button
                  variant="raised"
                  color="primary"
                  type="submit"
                  onClick={this.saveEvent}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </section>
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
