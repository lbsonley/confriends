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

// material ui theme
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

// my components
import ListContainer from './Containers/ListContainer/ListContainer';
import ConferenceDetailsContainer from './Containers/ConferenceDetailsContainer/ConferenceDetailsContainer';
import Profile from './Components/Profile/Profile';
import Callback from './Auth/Callback';
import Dummy from './Components/Dummy';
import Header from './Components/Header/Header';
import NavMain from './Components/NavMain/NavMain';

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
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
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
                    <Route path="/" render={() => <NavMain />} />
                  </Switch>
                ) : (
                  <Route exact path="/" render={() => <NavMain />} />
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
                  <ListContainer
                    auth={auth}
                    listName="conferences"
                    {...props}
                  />
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
        </MuiThemeProvider>
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
