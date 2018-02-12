/**
 * App.js
 * @desc
 * @author BeS
 */

// react base
import React, { Component } from 'react';

// react extensions
import { Router, Route, Redirect, Switch } from 'react-router-dom';

// utilities
import bows from 'bows';

// my components
import ListContainer from './Containers/ListContainer/ListContainer';
import ConferenceDetailsContainer from './Containers/ConferenceDetailsContainer/ConferenceDetailsContainer';
import Profile from './Components/Profile/Profile';
import Callback from './Auth/Callback';
import Dummy from './Components/Dummy';
import Header from './Components/Header/Header';
import UpdateAttendeeForm from './Components/UpdateAttendeeForm/UpdateAttendeeForm';
import AddEventForm from './Components/AddEventForm/AddEventForm';

// my utils
import Auth from './Auth/Auth';
import history from './Assets/js/utils/history';

// css
import './Assets/css/fonts.css';
import './App.css';

const auth = new Auth();

class App extends Component {
  componentWillMount = () => {
    this.setState({ profile: {} });
    const { userProfile, getProfileAsync, isAuthenticated } = auth;
    if (isAuthenticated()) {
      if (!userProfile) {
        getProfileAsync()
          .then(profile => this.setState({ profile }))
          .catch(err => console.log(err));
      } else {
        console.log('using cached profile:', userProfile);
        this.setState({ profile: userProfile });
      }
    } else {
      this.logger('log in to fetch profile');
    }
  };

  login = () => {
    if (localStorage) {
      localStorage.setItem('forwardEvent', window.location.pathname);
    }
    auth.login();
  };

  logout = () => {
    auth.logout();
  };

  requireAuth = () => {
    auth.requireAuth();
  };

  handleAuthentication = (nextState /* , replace */) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
      auth
        .handleAuthentication()
        .then(() => {
          const redirectPath = localStorage.getItem('forwardEvent');
          if (redirectPath) {
            history.push(redirectPath);
            localStorage.removeItem('forwardEvent');
          }
        })
        .then(auth.getProfileAsync)
        .then(profile => this.setState({ profile }))

        .catch(err => console.log(err));
    }
  };

  logger = bows('App');

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
              this.handleAuthentication(props);
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

          <Switch>
            <Redirect from="/" exact to="/conferences" />
          </Switch>
          <Route exact path="/dummy" component={Dummy} />
          {/* <section className="content"> */}
          <Route
            exact
            path="/conferences"
            render={props => (
              <ListContainer
                getAccessToken={auth.getAccessToken}
                isAuthenticated={auth.isAuthenticated}
                listName="conferences"
                {...props}
              />
            )}
          />
          <Route exact path="/add-event" component={AddEventForm} />
          <Route
            exact
            path="/edit/:collectionName/:id"
            component={AddEventForm}
          />
          <Route
            exact
            path="/:collectionName/:id"
            render={props => (
              <ConferenceDetailsContainer
                getIdToken={auth.getIdToken}
                setupUserManagementAPI={auth.setupUserManagementAPI}
                isAuthenticated={auth.isAuthenticated}
                onLoginClick={this.login}
                profile={this.state.profile}
                {...props}
              />
            )}
          />
          <Route
            path="/edit/:collectionName/:id/:userId"
            render={props => (
              <UpdateAttendeeForm profile={this.state.profile} {...props} />
            )}
          />
          <Route
            path="/profile"
            render={props =>
              auth.isAuthenticated() ? (
                <Profile profile={this.state.profile} {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
          {/* </section> */}
        </div>
      </Router>
    );
  }
}

App.propTypes = {};

export default App;
