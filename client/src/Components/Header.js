import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="app-header">
    <h1 className="app-title">
      <Link exact="true" to="/" href="/">
        Confriends
      </Link>
    </h1>
  </header>
);

export default Header;
