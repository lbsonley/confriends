import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './FlexList.css';

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
    <li className="flex-list__item">
      <Link
        to={`/${props.listName}/${props.item._id}`} // eslint-disable-line no-underscore-dangle
        href={`/${props.listName}/${props.item._id}`} // eslint-disable-line no-underscore-dangle
      >
        <div className={props.optionalClass}>
          {props.item.image && (
            <div className={`${props.optionalClass}__image`}>
              <img
                src={props.item.image}
                alt="alt"
                style={{ height: 60, width: 60 }}
              />
            </div>
          )}
          <div className={`${props.optionalClass}__content`}>
            <h3>{props.item.name}</h3>
            <p>
              {props.item.location.city}, {props.item.location.country}
            </p>
            <p>{formatDate(props.item.date)}</p>
          </div>
        </div>
      </Link>
    </li>
  );
};

VisualListItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.shape({
      city: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
    }).isRequired,
    date: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  listName: PropTypes.string.isRequired,
  optionalClass: PropTypes.string,
};

VisualListItem.defaultProps = {
  optionalClass: 'conference-teaser',
};

const FlexList = ({ list, listName }) => {
  const listItems = list.map(item => (
    <VisualListItem
      key={item._id} // eslint-disable-line no-underscore-dangle
      item={item}
      listName={listName}
      optionalClass="conference-teaser"
    />
  ));

  return <ul className="flex-list">{listItems}</ul>;
};

FlexList.propTypes = {
  listName: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FlexList;
