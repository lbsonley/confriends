// react core
import React from 'react';

// react extensions
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material ui
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Card, { CardContent } from 'material-ui/Card';

import './FlexList.css';

const styles = theme => ({
  card: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
});

const VisualListItem = ({ classes, listName, item }) => {
  const formatDate = dateString => {
    const dateObj = new Date(dateString);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    return months[monthIndex]
      ? `${months[monthIndex]} ${day}, ${year}`
      : dateString;
  };

  return (
    <Grid item xs={12} className={`flex-list__item ${classes.card}`}>
      <Link
        to={`/${listName}/${item._id}`} // eslint-disable-line no-underscore-dangle
        href={`/${listName}/${item._id}`} // eslint-disable-line no-underscore-dangle
      >
        <Card>
          <CardContent>
            <Typography variant="headline" gutterBottom>
              {item.name}{' '}
            </Typography>
            <Typography variant="body1">
              {item.city}, {item.country}
            </Typography>
            <Typography variant="body1">{formatDate(item.date)}</Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
};

VisualListItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
  }).isRequired,
  listName: PropTypes.string.isRequired,
};

export default withStyles(styles)(VisualListItem);
