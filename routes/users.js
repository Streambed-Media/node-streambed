var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../task-manager/src/models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**Put you DB path here, you can use this default path to host it local at this address */
mongoose.connect('mongodb://localhost/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

/*POST users listing, posting to /users with json will create entry in DB */
/***Currently hashes password using bcrypt, it also checks if email was used and wont let another user be created with the same email twice */
router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email exists'
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

/*POST to login exsiting user************************************************/
/*Uses jwt to prodeuce web token************************************************/
router.post('/login', (req, res, next) => {
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
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
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
