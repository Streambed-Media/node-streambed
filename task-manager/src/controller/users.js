const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//! This was taking from Brad's index route
const client = require('../../../client');
let accessToken = '';
const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube'
];
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/***Using MVC model, this holds functions for the routes */
/***Currently hashes password using bcrypt, it also checks if email was used and wont let another user be created with the same email twice */
exports.user_sign_up = (req, res, next) => {
  console.log(req.body);
  User.find({ email: req.body.email[0] })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email exists'
        });
      } else {
        bcrypt.hash(req.body.password[0], 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              displayName: req.body.displayName,
              email: req.body.email[0],
              password: hash
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: 'User Created',
                  createdUser: user
                });
              })
              .catch((err) => {
                console.log(err);
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

/*Uses jwt to prodeuce web token************************************************/
exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          });
        } else if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h'
            }
          );
          return res.status(200).json({
            message: 'Auth successful',
            token: token
          });
          //! This was taking from Brad's /dashboard route, it allows login if the user is in the database. Just for demonstration of login NOT GOOD
          // client
          //   .authenticate(scopes)
          //   .then((data) => {
          //     console.log(data.credentials.access_token);
          //     accessToken = data.credentials.access_token;
          //     res.redirect(
          //       'http://localhost:5000' + '?access_token=' + accessToken
          //     );
          //     //    res.render('dashboard', { title: 'Youtube', display: "block", nav_items_show: "block" })
          //   })
          //   .catch(console.err);
          //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//Pulls displayNames to compare on the front end
exports.user_display_names = (req, res, next) => {
  User.find()
    .select('displayName')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        users: docs
      };
      console.log(response);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
