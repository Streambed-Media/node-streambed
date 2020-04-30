# Streambed Upload

## Prerequisites

Before you begin, ensure you have met the following requirements:

- If you haven't already set up a Google API account: https://console.developers.google.com/
- Set up New Project.
- Set up Credentials.
- Enable APIS and services within Google API & Services: Youtube Analytics API, YouTube Data API v3.
- Whitelist domain, ex: http://streambed.com
- Add callback url, ex: http://localhost:3000/oauth2callback (ran from server, localhost ok)
- Download OAuth 2.0 Client IDs and save API key (apiKey) used for oauthTwo.keys.json file which is
  added in the root directory example below of localhost (development):

```JSON
{
  "web": {
    "client_id": "1098309487208-1849087109847nn76d4.apps.googleusercontent.com",
    "project_id": "streambed-analytics",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "lLnY7kIjHHtr54FFcxsT",
    "redirect_uris": ["http://localhost:3000/oauth2callback"],
    "javascript_origins": ["http://localhost:3000", "http://localhost"],
    "apiKey": "9oaX7PVvJM0AIzSz5jaSyFq0CzXUADkYSnKipl8"
  }
}
```

Create a .env file. Example

```
NODE_ENV='development'
MONGO_URL=''
SESS_NAME='dopeName'
SESS_SECRET='secretman'
RPC_USER='user'
RPC_PASS='pass'
RPC_HOST='192.168.1.101'
RPC_PORT='7313'
WALLET_ADDRESS=''
APP_URL='http://localhost:5000/'

```

## Installing <Streambed Upload>

To install <Streambed Upload>, follow these steps:

```
npm install
```

## Using in Production <Streambed Upload>

To use <Streambed Upload>, follow these steps:

```
npm start
```

## Using in Development<Streambed Upload>

To use <Streambed Upload>, follow these steps:

```
npm run build
```

```
npm run test-dev
```

Run the app in development mode. Open http://localhost:5000 to view it in the browser.
