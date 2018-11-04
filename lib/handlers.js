const HttpStatus = require('http-status-codes');
const authHelper = require('./helper/githubAuthHelper');
const userHelper = require('./helper/userHelper');
const response = require('./helper/response');

const {
  APP_COOKIE_NAME,
} = process.env;

module.exports.githubAuthPostSetup = async (event, context, callback) => {
  console.log('BEGIN githubAuthPostSetup');
  try {
    const location = authHelper.getAuthUri();
    console.log(`LOCATION ${location}`);
    return response(
      HttpStatus.SEE_OTHER,
      {
        Location: location,
      },
      null,
      callback,
    );
  } catch (e) {
    console.log('END githubAuthPostSetup');
    console.log('-----githubAuthPostSetup Error-----');
    console.error(e);
    return response(
      HttpStatus.INTERNAL_SERVER_ERROR, {}, {
        error: true,
        requestId: event.requestContext.requestId,
        message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
      },
      callback,
    );
  }
};

module.exports.githubFetchSetup = async (event, context, callback) => {
  try {
    const {
      found,
      data,
    } = await authHelper.checkCookie(event);

    if (found) {
      return response(
        HttpStatus.OK, {}, {
          error: false,
          requestId: event.requestContext.requestId,
          message: 'Already logged In.',
          data: {
            user: data.user,
            tokenDetail: Object.prototype.hasOwnProperty.call(data, 'auth') ? data.auth : '',
          },
        },
        callback,
      );
    }

    const code = event.queryStringParameters && event.queryStringParameters.code
      ? event.queryStringParameters.code
      : undefined;
    if (code) {
      const fetchTokenDetail = await authHelper.fetchToken(code);

      if (Object.prototype.hasOwnProperty.call(fetchTokenDetail, 'token')) {
        const {
          token,
        } = fetchTokenDetail;
        const userDetail = await userHelper.fetchUserDetail(token);
        await authHelper.createAuthRecordInDB(code, token, userDetail);
        return response(
          HttpStatus.OK, {
            'Set-Cookie': authHelper.setCookie(APP_COOKIE_NAME, code),
          }, {
            error: false,
            requestId: event.requestContext.requestId,
            message: 'User token details added successfully',
            data: {
              user: userDetail,
              tokenDetail: token,
            },
          },
          callback,
        );
      }
    }

    return response(
      HttpStatus.UNAUTHORIZED, {}, {
        error: true,
        requestId: event.requestContext.requestId,
        message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
      },
      callback,
    );
  } catch (e) {
    console.log('-----fetchSetup Error-----');
    console.error(e);
    return response(
      HttpStatus.INTERNAL_SERVER_ERROR, {}, {
        error: true,
        requestId: event.requestContext.requestId,
        message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
      },
      callback,
    );
  }
};
