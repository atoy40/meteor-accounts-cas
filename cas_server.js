"use strict";

const Fiber = Npm.require('fibers');
const https = Npm.require('https');
const url = Npm.require('url');
const xmlParser = Npm.require('xml2js');

// Library
class CAS {
  constructor(options) {
    options = options || {};

    if (!options.base_url) {
      throw new Error('Required CAS option `base_url` missing.');
    }

    if (!options.service) {
      throw new Error('Required CAS option `service` missing.');
    }

    const cas_url = url.parse(options.base_url);
    if (cas_url.protocol != 'https:' ) {
      throw new Error('Only https CAS servers are supported.');
    } else if (!cas_url.hostname) {
      throw new Error('Option `base_url` must be a valid url like: https://example.com/cas');
    } else {
      this.hostname = cas_url.host;
      this.port = 443;// Should be 443 for https
      this.base_path = cas_url.pathname;
    }

    this.service = options.service;
  }

  validate(ticket, callback) {
    const httparams = {
      host: this.hostname,
      port: this.port,
      path: url.format({
        pathname: this.base_path,
        query: {ticket: ticket, service: this.service},
      }),
    };

    https.get(httparams, (res) => {
      res.on('error', (e) => {
        console.log('error' + e);
        callback(e);
      });

      // Read result
      res.setEncoding('utf8');
      let response = '';
      res.on('data', (chunk) => {
        response += chunk;
      });

      res.on('end', (error) => {
        if (error) {
          console.log('error callback');
          console.log(error);
          callback(undefined, false);
        } else {
          xmlParser.parseString(response, (err, result) => {
            if (err) {
              callback({message: 'Bad response format. XML could not parse it'});
            } else {
              if (result['cas:serviceResponse']['cas:authenticationSuccess']) {
                const userData = {
                  lastName: result['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:nom'][0],
                  firstName: result['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:prenom'][0],
                  id: result['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:user'][0],
                }
                callback(undefined, true, userData);
              } else {
                callback(undefined, false);
              }
            }
          });
        }
      });
    });
  }
}
////// END OF CAS MODULE

let _casCredentialTokens = {};
let _userData = {};

RoutePolicy.declare('/_cas/', 'network');

// Listen to incoming OAuth http requests
WebApp.connectHandlers.use((req, res, next) => {
  // Need to create a Fiber since we're using synchronous http calls and nothing
  // else is wrapping this in a fiber automatically

  Fiber(() => {
    middleware(req, res, next);
  }).run();
});

const middleware = (req, res, next) => {
  // Make sure to catch any exceptions because otherwise we'd crash
  // the runner
  try {
    const barePath = req.url.substring(0, req.url.indexOf('?'));
    const splitPath = barePath.split('/');

    // Any non-cas request will continue down the default
    // middlewares.
    if (splitPath[1] !== '_cas') {
      next();
      return;
    }

    // get auth token
    const credentialToken = splitPath[2];
    if (!credentialToken) {
      closePopup(res);
      return;
    }

    // validate ticket
    casTicket(req, credentialToken, () => {
      closePopup(res);
    });

  } catch (err) {
    console.log("account-cas: unexpected error : " + err.message);
    closePopup(res);
  }
};

const casTicket = (req, token, callback) => {
  // get configuration
  if (!Meteor.settings.cas && !Meteor.settings.cas.validate) {
    console.log("accounts-cas: unable to get configuration");
    callback();
  }

  // get ticket and validate.
  const parsedUrl = url.parse(req.url, true);
  const ticketId = parsedUrl.query.ticket;

  const cas = new CAS({
    base_url: Meteor.settings.cas.baseUrl,
    service: Meteor.absoluteUrl() + "_cas/" + token,
  });

  cas.validate(ticketId, (err, status, userData) => {
    if (err) {
      console.log("accounts-cas: error when trying to validate " + err);
      console.log(err);
    } else {
      if (status) {
        console.log("accounts-cas: user validated " + userData.id);
        _casCredentialTokens[token] = { id: userData.id };
        _userData = userData;
      } else {
        console.log("accounts-cas: unable to validate " + ticketId);
      }
    }
    callback();
  });

  return;
};

/*
 * Register a server-side login handle.
 * It is call after Accounts.callLoginMethod() is call from client.
 *
 */
 Accounts.registerLoginHandler((options) => {
  if (!options.cas)
    return undefined;

  if (!_hasCredential(options.cas.credentialToken)) {
    throw new Meteor.Error(Accounts.LoginCancelledError.numericError,
      'no matching login attempt found');
  }

  const result = _retrieveCredential(options.cas.credentialToken);

  options = { profile: { firstName: _userData.firstName, lastName: _userData.lastName, loiretUserId: _userData.id }, emails: [], roles: ['student']};
  const queryResult = Accounts.updateOrCreateUserFromExternalService("cas", result, options);
  Roles.setUserRoles(queryResult.userId, 'student');

  return queryResult;
});

const _hasCredential = (credentialToken) => {
  return _.has(_casCredentialTokens, credentialToken);
}

/*
 * Retrieve token and delete it to avoid replaying it.
 */
const _retrieveCredential = (credentialToken) => {
  const result = _casCredentialTokens[credentialToken];
  delete _casCredentialTokens[credentialToken];
  return result;
}

const closePopup = (res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  const content = '<html><body><div id="popupCanBeClosed"></div></body></html>';
  res.end(content, 'utf-8');
}
