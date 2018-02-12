/**
 * Provider.js
 * @author Ben Sonley
 * @desc - a Higher order component to provide context as props to children down the component tree
 * based on https://github.com/rwieruch/react-provider-pattern
 * https://www.robinwieruch.de/react-provider-pattern-context/
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Provider extends Component {
  getChildContext() {
    return {
      ...this.props,
    };
  }

  render() {
    return <div> {this.props.children}</div>;
  }
}

Provider.propTypes = {
  children: PropTypes.object.isRequired,
  eventId: PropTypes.string,
  isAuthenticated: PropTypes.func.isRequired,
  removeAttendee: PropTypes.func.isRequired,
};

Provider.defaultProps = {
  eventId: null,
};

Provider.childContextTypes = {
  eventId: PropTypes.string,
  collectionName: PropTypes.string,
  isAuthenticated: PropTypes.func.isRequired,
  removeAttendee: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
};

const withContext = contextTypes => Component => {
  const WithContext = (props, context) => <Component {...props} {...context} />;

  WithContext.contextTypes = contextTypes;

  return WithContext;
};

export { Provider, withContext };
