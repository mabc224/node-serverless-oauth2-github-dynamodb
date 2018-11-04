const simpleOauth2 = require('simple-oauth2');

const {
  GITHUB_BASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_TOKEN_PATH, GITHUB_AUTHORIZE_PATH,
} = process.env;

const authCredentials = {
  client: {
    id: GITHUB_CLIENT_ID,
    secret: GITHUB_CLIENT_SECRET,
  },
  auth: {
    tokenHost: GITHUB_BASE_URL,
    tokenPath: GITHUB_TOKEN_PATH,
    authorizeHost: GITHUB_BASE_URL,
    authorizePath: GITHUB_AUTHORIZE_PATH,
  },
};

module.exports = simpleOauth2.create(authCredentials);
