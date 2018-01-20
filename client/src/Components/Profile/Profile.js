import React from 'react';
import PropTypes from 'prop-types';

const Profile = ({ profile }) => (
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

Profile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    nickname: PropTypes.string,
    picture: PropTypes.string,
  }).isRequired,
};

export default Profile;
