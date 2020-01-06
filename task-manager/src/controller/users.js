const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//! This was taking from Brad's index route
const client = require('../../../client');
let accessToken = '';

/***Using MVC model, this holds functions for the routes */
/***Currently hashes password using bcrypt, it also checks if email was used and wont let another user be created with the same email twice */
exports.user_sign_up = (req, res) => {
  console.log('TEST');
  const { displayName, email, password } = req.body;
  console.log(req.body);
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

// Leaving incase we want to add a jwt token instead of session id
exports.user_login = (req, res, next) => {
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
};

//Pulls displayNames to compare on the front end
exports.user_display_names = (req, res, next) => {
  User.find()
    .select('displayName')
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
