const { GITHUB_BASE_URL_ACCESS_CONTROL_ORIGIN } = process.env;

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*' || GITHUB_BASE_URL_ACCESS_CONTROL_ORIGIN, // Need to add base url at first place
  'Access-Control-Allow-Credentials': true,
};

module.exports = (statusCode, headers, data, cb) => {
  cb(null, {
    statusCode,
    headers: Object.assign({}, defaultHeaders, headers),
    body: JSON.stringify(data),
  });
};
