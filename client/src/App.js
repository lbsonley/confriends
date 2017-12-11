/**
 * App.js
 * @desc Renders main application header
 * @author BeS
 */

import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Media from 'react-media';

import ListContainer from './Containers/ListContainer';
import ConferenceDetailsContainer from './Containers/ConferenceDetailsContainer';
import Profile from './Components/Profile/Profile';
import Callback from './Auth/Callback';
import Dummy from './Components/Dummy';
import Header from './Components/Header/Header';
import NavMain from './Components/NavMain/NavMain';

import Auth from './Auth/Auth';
import history from './utils/history';

import './App.css';

const auth = new Auth();

const handleAuthentication = (nextState /* , replace */) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

class App extends Component {
  login = () => {
    auth.login();
  };

  logout = () => {
    auth.logout();
  };

  render() {
    return (
      <Router history={history}>
        <div className="app-grid">
          <Header
            isAuthenticated={auth.isAuthenticated}
            onLoginClick={this.login}
            onLogoutClick={this.logout}
          />

          <Route
            path="/login"
            render={props => {
              handleAuthentication(props);
              return <Callback {...props} />;
            }}
          />

          {/* logic to determine whether or not to display the dashboard on the homepage */}
          <Media query="(min-width: 481px)">
            {matches =>
              matches ? (
                <Switch>
                  <Redirect from="/" exact to="/dummy" />
                  <Route
                    path="/"
                    render={() => (
                      <NavMain isAuthenticated={auth.isAuthenticated} />
                    )}
                  />
                </Switch>
              ) : (
                <Route
                  exact
                  path="/"
                  render={() => (
                    <NavMain isAuthenticated={auth.isAuthenticated} />
                  )}
                />
              )
            }
          </Media>

          <section className="app-content">
            <Route exact path="/dummy" component={Dummy} />
            <Route
              exact
              path="/conferences"
              onEnter={auth.requireAuth}
              render={props => (
                <ListContainer auth={auth} listName="conferences" {...props} />
              )}
            />
            <Route
              exact
              path="/team-building"
              render={props => (
                <ListContainer
                  auth={auth}
                  listName="team-building"
                  {...props}
                />
              )}
            />
            <Route
              path="/:collectionName/:id"
              render={props => (
                <ConferenceDetailsContainer auth={auth} {...props} />
              )}
            />
            <Route
              path="/profile"
              render={props =>
                auth.isAuthenticated() ? (
                  <Profile auth={auth} {...props} />
                ) : (
                  <Redirect to="/" />
                )
              }
            />
          </section>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  auth: PropTypes.shape({
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
