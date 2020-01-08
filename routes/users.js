var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../task-manager/src/models/user');
const checkAuth = require('../task-manager/src/middleware/check-auth');
const UsersController = require('../task-manager/src/controller/users');

/**Put you DB path here, you can use this default path to host it local at this address */
mongoose
  .connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .catch((error) =>
    console.log('Mongoose Connection not working, the Error: ', error)
  );

const redirectDashboard = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/users/login');
  } else {
    console.log("Session Id doesn't exist");
    next();
  }
};

/*POST user signup, posting to /users/signup with json will create entry in DB */
router.post('/signup', redirectDashboard, UsersController.user_sign_up);

// Pretty much only used if session id still exist
router.get('/login', (req, res) => {
  res.render('dashboard');
});

router.post('/login', async (req, res) => {
<<<<<<< HEAD
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log('user: ', user);
    // const token = await User.generateAuthToken()

    req.session.userId = user._id;
    console.log('login session', req.session);
    res.render('dashboard');
  } catch (e) {
    console.log(e);
    res.redirect('/?error=' + e);
  }
=======
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password )
        console.log('user: ', user)
        
        req.session.userId = user._id
        console.log('login session',req.session)
        res.render('dashboard')

    }catch(e) {
        console.log(e)
        res.redirect('/?error=' + e)
    }
>>>>>>> updated all babel moved to dev, webpack , env variable
});

// GET all displayNames!
router.get('/', UsersController.user_display_names);

module.exports = router;
