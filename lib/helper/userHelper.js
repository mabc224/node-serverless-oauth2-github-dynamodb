const request = require('request-promise-native');

const { GITHUB_API_BASE_URL } = process.env;

module.exports = {
  fetchUserDetail: (tokenDetail) => {
    const { token_type: tokenType, access_token: accessToken } = tokenDetail;
    const options = {
      uri: `${GITHUB_API_BASE_URL}/user`,
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
        'user-agent': 'node.js',
      },
      json: true,
    };

    return request(options)
      .then(userData => userData)
      .catch((err) => {
        console.log('-----fetchUserDetails Error-----');
        throw err;
      });
  },
};
