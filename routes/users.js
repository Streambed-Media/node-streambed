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

// Refresh rT
router.get('/rt', UsersController.user_rt);

//Get the rT for frontend
router.get('/getrT', UsersController.user_getrT);

//Remove rT from DB and unAuth
router.post('/deleterT', UsersController.user_deleterT);

module.exports = router;
