var express = require('express');
var router = express.Router();
const UsersController = require('../task-manager/src/controller/users');

/*POST user signup, posting to /users/signup with json will create entry in DB */
router.post('/signup', UsersController.user_sign_up);

// Pretty much only used if session id still exist
router.get('/login', UsersController.user_login_get);

//Acutal route to check login creds
router.post('/login', UsersController.user_login_post);

/****Route to reset password*************/
router.post('/reset', UsersController.user_resetpw);

// Get rT
router.get('/rt', UsersController.user_rt);

// Set if you want to be remebered
router.post('/remember', UsersController.user_remember);

//Get if they want to be remebered to set state on the frontend
router.get('/getremember', UsersController.user_getremember);

module.exports = router;
