var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../task-manager/src/models/user.js');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/*POST users listing, posting to /users with json will create entry in DB */
/***Currently hashes password using bcrypt, it also checks if email was used and wont let another user be created with the same email twice */
router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email Exists'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
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
});
/**************************************************************************/

/*GET all displayNames! ***********************************************************/
router.get('/', (req, res, next) => {
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
});
/**************************************************************************/

module.exports = router;
