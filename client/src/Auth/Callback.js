/**
 * Callback.js
 * @desc component rendered while waiting for auth0 to set the session when a user logs in
 * @author BeS
 */

import React from 'react';
import loading from '../Assets/media/img/kiev.jpg';

const Callback = () => {
  const style = {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  };

  return (
    <div style={style}>
      <img src={loading} alt="loading" />
    </div>
  );
};

export default Callback;
