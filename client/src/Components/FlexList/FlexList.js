// react core
import React from 'react';

// react extensions
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material ui
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

import VisualListItem from './ListItem';
import './FlexList.css';

const FlexList = ({ list, listName, classes, ...props }) => {
  const listItems = list.map(item => (
    <VisualListItem
      key={item._id} // eslint-disable-line no-underscore-dangle
      item={item}
      listName={listName}
      optionalClass="event-teaser"
    />
  ));

  return (
    <section>
      <Grid container alignItems="center" style={{ padding: 20 }} spacing={24}>
        <Grid item xs={8}>
          <Typography type="display1">Upcoming Events</Typography>
        </Grid>
        <Grid item xs={4} style={{ textAlign: 'right' }}>
          {props.isAuthenticated() ? (
            <Button raised color="primary" component={Link} to={`/add-event`}>
              Add an Event
            </Button>
          ) : null}
        </Grid>
      </Grid>
      <Grid container style={{ padding: 20 }} spacing={24}>
        {listItems}
      </Grid>
    </section>
  );
};

const styles = theme => ({
  header: {
    padding: theme.spacing.unit * 3,
  },
});

FlexList.propTypes = {
  listName: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(FlexList);
