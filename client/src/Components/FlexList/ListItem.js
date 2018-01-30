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

import './FlexList.css';

const styles = theme => ({
  card: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
});

const VisualListItem = props => {
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
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      className={`flex-list__item ${props.classes.card}`}
    >
      <Link
        to={`/${props.listName}/${props.item._id}`} // eslint-disable-line no-underscore-dangle
        href={`/${props.listName}/${props.item._id}`} // eslint-disable-line no-underscore-dangle
      >
        <Card>
          <CardContent>
            <Typography type="headline" gutterBottom>
              {props.item.name}{' '}
            </Typography>
            <Typography type="body1">
              {props.item.city}, {props.item.country}
            </Typography>
            <Typography type="body1">{formatDate(props.item.date)}</Typography>
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
  listName: PropTypes.string.isRequired,
  optionalClass: PropTypes.string,
};

VisualListItem.defaultProps = {
  optionalClass: 'event-teaser',
};

export default withStyles(styles)(VisualListItem);
