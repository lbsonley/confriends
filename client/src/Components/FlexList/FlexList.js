// react core
import React from 'react';

// react extensions
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material ui
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

// my components
import PageHeader from '../../Molecules/PageHeader';
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
    <div>
      <PageHeader title="Upcoming Events" />
      <section className="content">
        <Grid container style={{ padding: 20 }} spacing={24}>
          {props.isAuthenticated() ? (
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              <Button raised color="primary" component={Link} to="/add-event">
                Add an Event
              </Button>
            </Grid>
          ) : null}
          {listItems}
        </Grid>
      </section>
    </div>
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
