var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../task-manager/src/models/user');
const checkAuth = require('../task-manager/src/middleware/check-auth');
const UsersController = require('../task-manager/src/controller/users');
const bcrypt = require('bcrypt');

//This is used to avoid error with depreciation with findoneandupdate in the reset route
mongoose.set('useFindAndModify', false);

/**Put you DB path here, you can use this default path to host it local at this address */
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .catch((error) =>
    console.log('Mongoose Connection is not working, the Error: ', error)
  );

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

module.exports = router;
