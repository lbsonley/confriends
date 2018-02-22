export default {
  domain: 'appfaktory.eu.auth0.com',
  clientId: 'ohfRFj20yxd7mukUmFuNbYecOds5iWzv',
  audience: 'https://localhost:3000/api',
  redirectUri:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/login'
      : 'https://confriends.bensonley.com/login',
};
