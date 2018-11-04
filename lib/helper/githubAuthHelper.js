const dynamodb = require('serverless-dynamodb-client').doc;
const cookiejs = require('cookie');
const moment = require('moment');

const oauth2 = require('./githubOauth2Helper');

const {
  APP_COOKIE_NAME, GITHUB_SCOPES, GITHUB_REDIRECT_URI,
  DYNAMODB_TABLES_AUTH,
} = process.env;

const removeEmptyValFromObj = (obj) => {
  Object.entries(obj).forEach(([key, val]) => {
    if (val && typeof val === 'object') removeEmptyValFromObj(val);
    else if (val === null || val === undefined || val.length === 0) delete obj[key];
  });
  return obj;
};

module.exports = {
  checkCookie: async (event) => {
    const getCookieFromEventHeader = event.headers.cookie || event.headers.Cookie;
    const cookieObj = (getCookieFromEventHeader && cookiejs.parse(getCookieFromEventHeader))
      ? cookiejs.parse(getCookieFromEventHeader)
      : null;

    const cookie = (cookieObj && cookieObj[APP_COOKIE_NAME])
      ? cookieObj[APP_COOKIE_NAME]
      : undefined;

    if (cookie) {
      const params = {
        TableName: DYNAMODB_TABLES_AUTH,
        Key: {
          id: cookie,
        },
      };
      try {
        const dbResult = await dynamodb.get(params).promise();

        if (Object.prototype.hasOwnProperty.call(dbResult, 'Item')) {
          return { found: true, data: dbResult.Item };
        }
        return { found: false, data: {} };
      } catch (e) {
        console.log('-----checkCookie Error-----');
        console.log(e);
        throw new Error('Request to check cookie from db failed');
      }
    }
    return { found: false, data: {} };
  },
  getAuthUri: () => oauth2.authorizationCode.authorizeURL({
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: GITHUB_SCOPES,
  }),
  fetchToken: async (code) => {
    try {
      const tokenConfig = {
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
        scope: GITHUB_SCOPES,
      };

      const result = await oauth2.authorizationCode.getToken(tokenConfig);
      return oauth2.accessToken.create(result);
    } catch (e) {
      console.log('-----fetchToken Error-----');
      console.log(e);
      throw new Error('Request to fetchToken failed');
    }
  },
  createAuthRecordInDB: (code, token, userDetail) => {
    const params = {
      TableName: DYNAMODB_TABLES_AUTH,
      Item: {
        id: code,
        auth: token,
        user: removeEmptyValFromObj(userDetail),
        createdAt: moment().utc().unix(),
        updatedAt: moment().utc().unix(),
      },
    };
    return dynamodb.put(params).promise();
  },
  setCookie: (key, val, options) => {
    const defaultOptions = {
      // domain: `${APP_COOKIE_DOMAIN}`,
      path: '/',
      // httpOnly: true,
      // secure: true,
      // expires: `${new Date().toUTCString()}`,
    };

    return cookiejs.serialize(key, val, Object.assign({}, defaultOptions, options));
  },
};
