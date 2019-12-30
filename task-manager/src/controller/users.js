const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//! This was taking from Brad's index route
const client = require('../../../client');
let accessToken = '';


/***Using MVC model, this holds functions for the routes */
/***Currently hashes password using bcrypt, it also checks if email was used and wont let another user be created with the same email twice */
exports.user_sign_up = (req, res, next) => {
  User.find({
    $or: [{ displayName: req.body.displayName }, { email: req.body.email }]
  })
    .then((user) => {
      console.log('user',user, user.length);
      if (user.length >= 1) {
        res.status(409).json({
          error: 'Display name or email already exists'
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
              email: req.body.email,
              password: hash
            });
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

/*Uses jwt to prodeuce web token************************************************/
exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
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

