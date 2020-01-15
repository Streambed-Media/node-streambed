'use strict';

const { google } = require('googleapis');
const fetch = require('node-fetch');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');
const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, 'oauthTwo.keys.json');

let keys = {
  redirect_uris: ['http://localhost:3000/oauth2callback']
};

if (fs.existsSync(keyPath)) {
  const keyFile = require(keyPath);
  keys = keyFile.installed || keyFile.web;
}

const invalidRedirectUri = `The provided keyfile does not define a valid
redirect URI. There must be at least one redirect URI defined, and this sample
assumes it redirects to 'http://localhost:3000/oauth2callback'.  Please edit
your keyfile, and add a 'redirect_uris' section.  For example:
"redirect_uris": [
  "http://localhost:3000/oauth2callback"
]`;

class Client {
  constructor(options) {
    this._options = options || { scopes: [] };

    // validate the redirectUri.  This is a frequent cause of confusion.
    if (!keys.redirect_uris || keys.redirect_uris.length === 0) {
      throw new Error(invalidRedirectUri);
    }
    const redirectUri = keys.redirect_uris[keys.redirect_uris.length - 1];
    const parts = new url.URL(redirectUri);
    if (
      redirectUri.length === 0 ||
      parts.port !== '3000' ||
      parts.hostname !== 'localhost' ||
      parts.pathname !== '/oauth2callback'
    ) {
      throw new Error(invalidRedirectUri);
    }

    // create an oAuth client to authorize the API call
    this.oAuth2Client = new google.auth.OAuth2(
      keys.client_id,
      keys.client_secret,
      redirectUri
    );
  }

  async authenticate(scopes, userId) {
    return new Promise((resolve, reject) => {
      // grab the url that will be used for authorization
      this.authorizeUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' ')
      });
      const server = http
        .createServer(async (req, res) => {
          try {
            if (req.url.indexOf('/oauth2callback') > -1) {
              const qs = new url.URL(req.url, 'http://localhost:3000')
                .searchParams;

              console.log(this.authorizeUrl);

              res.end(
                'Authentication successful! Please return to the console.'
              );
              server.destroy();
              const { tokens } = await this.oAuth2Client.getToken(
                qs.get('code')
              );

              //   this.oAuth2Client.credentials = tokens;
              //   resolve(this.oAuth2Client);
              this.oAuth2Client.setCredentials(tokens);

              /** This saves the rT to the db, userId is not accessible from the server so I sent it from when you click the youtube check box**/
              /** UserId is used in the route to look up the logged in user and save the rT**/
              if (tokens.refresh_token) {
                console.log(tokens.refresh_token);
                fetch('http://localhost:5000/users/rT', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    userId,
                    rT: tokens.refresh_token
                  })
                });
              }

              resolve(this.oAuth2Client);
            }
          } catch (e) {
            reject(e);
          }
        })
        .listen(3000, () => {
          // open the browser to the authorize url to start the workflow
          opn(this.authorizeUrl, { wait: false }).then((cp) => cp.unref());
        });

      destroyer(server);
    });
  }
  //TODO Pulls refresh token on front end with fetch, passes to here and sets refresh token. Now I dont know what to do
  refresh(rT) {
    this.oAuth2Client.setCredentials({
      refresh_token: rT
    });
    console.log('DID we make it?');
  }
  //TODO
}

module.exports = new Client();
