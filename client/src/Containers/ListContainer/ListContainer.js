/**
 * ListContainer.js
 * @desc the container for a list of events (conferences or social)
 * @author BeS
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bows from 'bows';
import 'whatwg-fetch';

import FlexList from '../../Components/FlexList/FlexList';

export default class ListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { eventList: [] };
    this.logger = bows('ListContainer');
  }

  componentDidMount() {
    const { getAccessToken } = this.props;
    fetch(`/api/${this.props.listName}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(data => {
        this.logger('setting new State with: ', data);
        this.setState({ eventList: data.events });
      })
      .catch(err => this.logger(err));

    this.logger('componentDidMount');
  }

  render() {
    return (
      <FlexList
        isAuthenticated={this.props.isAuthenticated}
        list={this.state.eventList}
        listName={this.props.listName}
      />
    );
  }
}

ListContainer.propTypes = {
  getAccessToken: PropTypes.func.isRequired,
  listName: PropTypes.string.isRequired,
};
