var express = require('express');
var router = express.Router();
const UsersController = require('../task-manager/src/controller/users');

const redirectDashboard = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/users/login');
  } else {
    res.redirect('/');
    console.log("Session Id doesn't exist");
    // next();
  }
};

/*POST user signup, posting to /users/signup with json will create entry in DB */
router.post('/signup', UsersController.user_sign_up);

// Pretty much only used if session id still exist
router.get('/login', UsersController.user_login_get);

//Acutal route to check login creds
router.post('/login', UsersController.user_login_post);

/****Route to reset password*************/
router.post('/reset', UsersController.user_resetpw);

/**** Route to add rT *****/
router.post('/rT', UsersController.user_rT);

module.exports = router;
