'use strict';

require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const User = require('./task-manager/src/models/user');

const keyPath = path.join(__dirname, 'oauthTwo.keys.json');
let keys = {
  redirect_uris: [process.env.APP_URL + '/oauth2callback']
};

if (fs.existsSync(keyPath)) {
  const keyFile = require(keyPath);
  keys = keyFile.installed || keyFile.web;
}

//*******************************************READ ME******************************************************/
/****** This Client.js is uesd to set up google Oauth, code below used package to create url***************/
/******Then a page is created with the URL which the user is directed to to auth***************************/
/******Tokens are set, then the refresh token is stored in the DB****************/

// https://github.com/googleapis/google-api-nodejs-client/blob/c00d1892fe70d7ebf934bcebe3e8a5036c62440c/README.md
/****************************************READ ME********************************************************* */

class Client {
  constructor(options) {
    // validate the redirectUri.  This is a frequent cause of confusion.
    if (!keys.redirect_uris || keys.redirect_uris.length === 0) {
      throw new Error('Invalid redirect uri');
    }
    this.redirectUri = keys.redirect_uris[keys.redirect_uris.length - 1];

    this.clients = {};
  }

  async get(userId) {
    let c = this.clients[userId];
    if (!c) {
      // create an oAuth client to authorize the API call
      c = new google.auth.OAuth2(
        keys.client_id,
        keys.client_secret,
        this.redirectUri
      );
      // Fetch refresh token
      const remember = await User.findOne(
        {
          _id: userId
        },
        'rT'
      );
      const { rT } = remember;
      c.setCredentials({
        refresh_token: rT
      });
      let token = await c.refreshAccessToken();
      c.access_token = token.access_token;
    }

    this.clients[userId] = c;
    return c;
  }

  async authenticate(scopes, userId) {
    let c = new google.auth.OAuth2(
      keys.client_id,
      keys.client_secret,
      this.redirectUri
    );
    console.log(c);
    // grab the url that will be used for authorization
    c.authorizeUrl = c.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' ')
    });

    this.clients[userId] = c;
    return c;
  }

  // * Pulls refresh token in remember route, passes to here and sets refresh token. Then refreshes the access token and passes it back
  async refresh(userId, rT) {
    console.log('Line 118 in Client.js rT saved');
    let c = await this.get(userId);
    c.setCredentials({
      refresh_token: rT
    });
  }

  async getOuttaHere(userId) {
    console.log('Line YETTTTTTT', userId);
    let c = await this.get(userId);
    c.revokeCredentials();
    console.log('Line meeee');
  }

  async getNewAcc(userId) {
    const c = await this.get(userId);
    let results = await c.refreshAccessToken();
    const { access_token } = results.credentials;
    return access_token;
  }
}

module.exports = new Client();
