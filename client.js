'use strict'

require('dotenv').config()
const {google} = require('googleapis')
const fs = require('fs')
const path = require('path')

const keyPath = path.join(__dirname, 'oauthTwo.keys.json')
let keys = {
  redirect_uris: [process.env.APP_URL + '/oauth2callback']
}

if (fs.existsSync(keyPath)) {
  const keyFile = require(keyPath)
  keys = keyFile.installed || keyFile.web
}

//*******************************************READ ME******************************************************/
/****** This Client.js is uesd to set up google Oauth, code below used package to create url***************/
/******Then a page is created with the URL which the user is directed to to auth***************************/
/******Tokens are set, then the refresh token is stored in the DB****************/

// https://github.com/googleapis/google-api-nodejs-client/blob/c00d1892fe70d7ebf934bcebe3e8a5036c62440c/README.md
/****************************************READ ME********************************************************* */

class Client {
  constructor (options) {
    // validate the redirectUri.  This is a frequent cause of confusion.
    if (!keys.redirect_uris || keys.redirect_uris.length === 0) {
      throw new Error('Invalid redirect uri')
    }
    this.redirectUri = keys.redirect_uris[keys.redirect_uris.length - 1]

    this.clients = {}
  }

  get(userId) {
    return this.clients[userId]
  }

  authenticate (scopes, userId) {
    let c = this.clients[userId]
    if (!c) {
      // create an oAuth client to authorize the API call
      c = new google.auth.OAuth2(
        keys.client_id,
        keys.client_secret,
        this.redirectUri
      )
    }

    // grab the url that will be used for authorization
    c.authorizeUrl = c.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' ')
    })

    this.clients[userId] = c
    return c
  }

  // * Pulls refresh token in remember route, passes to here and sets refresh token. Then refreshes the access token and passes it back
  refresh (userId, rT) {
    console.log('Line 118 in Client.js rT saved')
    this.clients[userId].setCredentials({
      refresh_token: rT
    })
  }

  getOuttaHere (userId) {
    console.log('Line YETTTTTTT')
    this.clients[userId].revokeCredentials()
  }

  async getNewAcc (userId) {
    const results = await this.clients[userId].refreshAccessToken()
    const {access_token} = results.credentials
    return access_token
  }
}

module.exports = new Client()
