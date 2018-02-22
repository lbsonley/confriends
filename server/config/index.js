const env = process.env.NODE_ENV || 'development';
const envConfig = require(`./${env}`); // eslint-disable-line import/no-dynamic-require

const defaultConfig = {
  env,
  port: 3001,
};

module.exports = Object.assign({}, defaultConfig, envConfig);
