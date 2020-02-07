var express = require('express');
var router = express.Router();
const UsersController = require('../task-manager/src/controller/users');

/*POST user signup, posting to /users/signup with json will create entry in DB */
router.post('/signup', UsersController.user_sign_up);

/*POST this stores wallet and pub after the user is confrimed created with no errors */
router.post('/storePubAndWallet', UsersController.user_store_wallet_pub);

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

//Get the mnemonic for frontend
router.get('/getmnemonic', UsersController.user_getmnemonic);

//Get the mnemonic for frontend
router.post('/comparepw', UsersController.user_pw_compare);

//Remove rT from DB and unAuth
router.post('/deleterT', UsersController.user_deleterT);

//Get publisher Id from DB
router.get('/pub', UsersController.user_pub);

module.exports = router;
