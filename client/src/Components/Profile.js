import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Profile extends Component {
  componentWillMount() {
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }
  render() {
    const { profile } = this.state;
    return (
      <div className="container">
        <div className="profile-area">
          <h1>{profile.name}</h1>
          <div header="Profile">
            <img src={profile.picture} alt="profile" />
            <div>
              <h3>Nickname</h3>
              <h3>{profile.nickname}</h3>
            </div>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  auth: PropTypes.shape({
    userProfile: PropTypes.object,
    getProfile: PropTypes.func.isRequired,
  }).isRequired,
};
