/* eslint-disable class-methods-use-this */
/**
 * service to manage and coordinate user authentication
 * @author BeS
 */

import decode from 'jwt-decode';
import auth0 from 'auth0-js';

import bows from 'bows';
import history from '../Assets/js/utils/history';
import config from './auth0.config';

export default class Auth {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getTokenExpirationDate = this.getTokenExpirationDate.bind(this);
    this.isTokenExpired = this.isTokenExpired.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.requireAuth = this.requireAuth.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.setSession = this.setSession.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.setupUserManagementAPI = this.setupUserManagementAPI.bind(this);
    this.getProfileAsync = this.getProfileAsync.bind(this);
  }
  logger = bows('Auth');

  auth0 = new auth0.WebAuth({
    domain: config.domain,
    clientID: config.clientId,
    redirectUri: config.redirectUri,
    audience: config.audience,
    responseType: 'token id_token',
    scope: 'openid profile',
  });

  // create a property on the class to cache userProfile
  userProfile;

  login() {
    this.auth0.authorize();
  }

  logout() {
    // Clear access token, ID token and expiration time from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to home route
    history.push('/');
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  getIdToken() {
    return localStorage.getItem('id_token');
  }

  getProfileAsync() {
    const accessToken = this.getAccessToken();
    const idToken = this.getIdToken();

    return new Promise((resolve, reject) => {
      if (accessToken && idToken) {
        const auth0Manage = this.setupUserManagementAPI(idToken);
        this.auth0.client.userInfo(accessToken, (err, profile) => {
          if (err) {
            reject(err);
          } else if (profile) {
            auth0Manage.getUser(profile.sub, (error, fullProfile) => {
              if (error) {
                reject(error);
              }
              this.userProfile = fullProfile;
              resolve(fullProfile);
            });
          }
        });
      }
    });
  }

  getProfile(cb) {
    const accessToken = this.getAccessToken();
    const idToken = this.getIdToken();

    this.userProfile = null;
    if (accessToken && idToken) {
      const auth0Manage = this.setupUserManagementAPI(idToken);
      this.auth0.client.userInfo(accessToken, (err, profile) => {
        if (profile) {
          auth0Manage.getUser(profile.sub, (error, fullProfile) => {
            this.userProfile = fullProfile;
            cb(error, fullProfile);
          });
        }
      });
    }
  }

  getTokenExpirationDate(encodedToken) {
    const token = decode(encodedToken);
    if (!token.exp) {
      return null;
    }

    const date = new Date(0); // eslint-disable-line
    date.setUTCSeconds(token.exp);

    return date;
  }

  isTokenExpired(token) {
    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate < new Date();
  }

  isLoggedIn() {
    const idToken = this.getIdToken();
    return !!idToken && !this.isTokenExpired(idToken);
  }

  requireAuth(nextState, replace) {
    if (!this.isLoggedIn()) {
      replace({ pathname: '/' });
    }
  }

  setupUserManagementAPI(idToken) {
    return new auth0.Management({
      domain: config.domain,
      token: idToken,
    });
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.logger('setting the sesh', authResult);
          this.setSession(authResult);
          history.push('/');
          resolve();
        } else if (err) {
          history.replace('/');
          this.logger('Error: ', err);
          reject(err);
        }
      });
    });
  }

  setSession(authResult) {
    // set the time at which the access token will expire
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime(),
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to home root
    // history.push('/');
  }

  isAuthenticated() {
    // Check wheter the current time is past the access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
