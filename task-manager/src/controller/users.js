const User = require('../models/user');
const bcrypt = require('bcrypt');
const client = require('../../../client');

/***Using MVC model, this holds functions for the routes */
/***USER CREATION,Currently hashes password using bcrypt, it also checks if email was used and wont let another user be created with the same email twice */
exports.user_sign_up = (req, res) => {
  const { displayName, email, password } = req.body;
  User.find({
    $or: [{ displayName: displayName }, { email: email }]
  })
    .then((user) => {
      if (user.length >= 1) {
        res.status(409).json({
          error: 'Display name or email already exists'
        });
      } else {
        bcrypt.hash(password, 8, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              displayName: displayName,
              email: email,
              password: hash
            });
            req.session.userId = user._id;
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: 'User Created',
                  createdUser: user
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    })
    .catch();
};
/***User creation end*/

/******Login GET */
exports.user_login_get = (req, res) => {
  const { userId } = req.session;

  // If session id doesn't exist skips redirects back to login page
  if (!userId) {
    console.log('For you tommy, long waited 🙂 ');
    res.redirect('/');
  } else {
    res.render('dashboard', { title: 'Streambed' });
  }
};
/****Login Get End */

/**Login POST */
exports.user_login_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect('/?error=' + e);
    }
    req.session.userId = user._id;
    console.log('login session', req.session);
    res.render('dashboard');
  } catch (e) {
    console.log(e);
    res.redirect('/?error=' + e);
  }
};
/**Login POST End*/

/****Reset password */
exports.user_resetpw = (req, res) => {
  const pass = req.body.password;
  bcrypt.hash(pass, 8, (err, hash) => {
    User.findOneAndUpdate(
      { _id: req.session.userId },
      { $set: { password: hash } }
    ).then(() => console.log(hash));
  });
};
/****Reset password End*/

//Retrieves the stored refreshToken and sets it in the client.js so the accessToken can be refreshed
/******Remember and rT GET */
exports.user_remember = async (req, res) => {
  try {
    const rememberInfo = await User.findOne(
      {
        _id: req.session.userId
      },
      'rT'
    );
    if (!rememberInfo) {
      //!
      // client.authenticate(scopes, req.session.userId).then((data) => {
      //   // const token = jwt.sign({token: data.credentials.access_token}, 'me')
      //   let token = data.credentials.access_token;
      //   // let token = '10821309850928375'
      //   access_token = token;
      //   res.header('authorization', token);
      //   res.status(200).render('dashboard');
      // });
      //!

      console.log('No remember');
      return res.status(404).json({ msg: 'No remember' });
    }
    let { rT } = rememberInfo;
    client.refresh(rT);
    const aT = await client.getNewAcc();
    console.log('ALMOST THERE', aT);

    res.header('authorization', aT);
    res.status(200).render('dashboard');
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
/****Remember and rT Get End */
