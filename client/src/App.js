/**
 * App.js
 * @desc
 * @author BeS
 */

// react base
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// react extensions
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import Media from 'react-media';

// my components
import ListContainer from './Containers/ListContainer/ListContainer';
import ConferenceDetailsContainer from './Containers/ConferenceDetailsContainer/ConferenceDetailsContainer';
import Profile from './Components/Profile/Profile';
import Callback from './Auth/Callback';
import Dummy from './Components/Dummy';
import Header from './Components/Header/Header';

// utils
import Auth from './Auth/Auth';
import history from './Assets/js/utils/history';

// css
import './Assets/css/fonts.css';
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
          {/* <Media query="(min-width: 481px)">
            {matches =>
              matches ? (
                <Switch>
                  <Redirect from="/" exact to="/dummy" />
                  <Route path="/" render={() => <NavMain />} />
                </Switch>
              ) : (
                <Route exact path="/" render={() => <NavMain />} />
              )
            }
          </Media> */}

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

App.propTypes = {};

export default App;
