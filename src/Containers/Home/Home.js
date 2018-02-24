// react core
import React from 'react';
import PropTypes from 'prop-types';

// react extensions
import { Link } from 'react-router-dom';

// material ui
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

// material ui icons
import Directions from 'material-ui-icons/Directions';
import PersonAdd from 'material-ui-icons/PersonAdd';
import LibraryAdd from 'material-ui-icons/LibraryAdd';
import CheckBox from 'material-ui-icons/CheckBox';
import DateRange from 'material-ui-icons/DateRange';
import Hotel from 'material-ui-icons/Hotel';

// utilities
import classNames from 'classnames';

// my components
import LinkButton from '../../Components/Button/LinkButton';

const Home = ({ classes, onLoginClick, isAuthenticated }) => {
  const textClasses = classNames({
    [classes.responsiveAlign]: true,
  });

  return (
    <section>
      {/* <PageHeader title="Welcome to Confriends" /> */}
      <div className="content">
        <Grid container className={classes.firstSection}>
          <Grid item xs={12} md={3}>
            <Typography className={textClasses}>
              <Directions className={classes.bigIcon} />
            </Typography>
          </Grid>
          <Grid item xs={12} md={9} className={textClasses}>
            <Typography variant="headline" paragraph>
              It can be a lot of work to get a group of people moving the same
              direction.
            </Typography>
            <Typography
              variant="headline"
              color="primary"
              style={{ paddingTop: 32, paddingBottom: 32 }}
            >
              Confriends helps coordinate... So you can get the herd moving in
              the right direction.
            </Typography>
            {isAuthenticated() ? (
              <Button
                variant="raised"
                className={classes.bigButton}
                color="primary"
                component={Link}
                to="/conferences"
              >
                Show me the events
              </Button>
            ) : (
              <div>
                <Button
                  variant="raised"
                  className={classes.bigButton}
                  color="primary"
                  onClick={onLoginClick}
                  style={{ marginRight: 32 }}
                >
                  Login to get started
                </Button>
                or
                <LinkButton
                  href="/conferences"
                  inlineStyles={{ marginLeft: 28 }}
                >
                  View the upcoming events
                </LinkButton>
              </div>
            )}
          </Grid>
        </Grid>
        <Grid
          container
          className={classes.newSection}
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Typography variant="display1" paragraph>
              Confriends lets you...
            </Typography>
          </Grid>
          <List>
            <ListItem>
              <ListItemIcon>
                <LibraryAdd className={classes.regularIcon} />
              </ListItemIcon>
              <ListItemText primary="Browse events, or create a new Event." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonAdd className={classes.regularIcon} />
              </ListItemIcon>
              <ListItemText primary="Sign up to attend an event." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckBox className={classes.regularIcon} />
              </ListItemIcon>
              <ListItemText primary="Track your approval." />
            </ListItem>
          </List>
        </Grid>
        <Grid className={classes.newSection}>
          <Grid item xs={12}>
            <Typography variant="display1" paragraph>
              New Features are being added regularly.
            </Typography>
            <Typography variant="headline" paragraph>
              Here are a few things you can expect soon:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <DateRange className={classes.regularIcon} />
                </ListItemIcon>
                <ListItemText primary="Travel date selector for registered attendees to agree upon a departure date." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Hotel className={classes.regularIcon} />
                </ListItemIcon>
                <ListItemText primary="Lodging selector for registered attendees to agree where they will stay." />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </div>
    </section>
  );
};

Home.propTypes = {
  classes: PropTypes.shape({
    bigIcon: PropTypes.string.isRequired,
    regularIcon: PropTypes.string.isRequired,
    responsiveAlign: PropTypes.string.isRequired,
    sidePad: PropTypes.string.isRequired,
    newSection: PropTypes.string.isRequired,
    firstSection: PropTypes.string.isRequired,
    bigButton: PropTypes.string.isRequired,
  }).isRequired,
  onLoginClick: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
};

const styles = theme => ({
  bigIcon: {
    fill: '#3a3a3a',
    height: 128,
    width: 128,
  },
  regularIcon: {
    fill: '#3a3a3a',
    [theme.breakpoints.up('md')]: {
      height: 96,
      width: 96,
    },
    [theme.breakpoints.down('sm')]: {
      height: 64,
      width: 64,
    },
  },
  responsiveAlign: {
    [theme.breakpoints.up('md')]: {
      textAlign: 'left',
    },
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  sidePad: {
    paddingRight: 24,
    paddingLeft: 24,
  },
  newSection: {
    paddingTop: 96,
  },
  firstSection: {
    [theme.breakpoints.up('md')]: {
      paddingTop: 128,
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: 96,
    },
  },
  bigButton: {
    padding: 24,
  },
});

export default withStyles(styles)(Home);
