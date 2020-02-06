'use strict';

require('dotenv').config();
const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');
const fs = require('fs');
const path = require('path');
const User = require('./task-manager/src/models/user');

const keyPath = path.join(__dirname, 'oauthTwo.keys.json');
console.log('OEJWORJWOERJWOEJROWJEROWJERJWEROWJEROJ', process.env.APP_URL )
let keys = {
  redirect_uris: [process.env.APP_URL + '/oauth2callback']
};

if (fs.existsSync(keyPath)) {
  const keyFile = require(keyPath);
  keys = keyFile.installed || keyFile.web;
}
console.log(keys);

//*******************************************READ ME******************************************************/
/****** This Client.js is uesd to set up google Oauth, code below used package to create url***************/
/******Then a page is created with the URL which the user is directed to to auth***************************/
/******Tokens are set, then the refresh token is stored in the DB****************/
// https://github.com/googleapis/google-api-nodejs-client/blob/c00d1892fe70d7ebf934bcebe3e8a5036c62440c/README.md
/****************************************READ ME********************************************************* */

class Client {
  constructor(options) {
    this._options = options || { scopes: [] };

    // validate the redirectUri.  This is a frequent cause of confusion.
    if (!keys.redirect_uris || keys.redirect_uris.length === 0) {
      throw new Error(invalidRedirectUri);
    }
    const redirectUri = keys.redirect_uris[keys.redirect_uris.length - 1];

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

      this.oAuth2Client.authorizeUrl = this.authorizeUrl;
      this.oAuth2Client.userId = userId;


      resolve(this.oAuth2Client);

    });
  }
  // * Pulls refresh token in remember route, passes to here and sets refresh token. Then refreshes the access token and passes it back
  refresh(rT) {
    console.log('Line 118 in Client.js rT saved');
    this.oAuth2Client.setCredentials({
      refresh_token: rT
    });
  }

  async getNewAcc() {
    const results = await this.oAuth2Client.refreshAccessToken();
    const { access_token } = results.credentials;
    return access_token;
  }
}

module.exports = new Client();
