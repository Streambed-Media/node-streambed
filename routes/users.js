var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../task-manager/src/models/user.js');

mongoose.connect('mongodb://localhost/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/*POST users listing, posting to /users with json will create entry in DB */
router.post('/', (req, res, next) => {
  const user = new User({
    displayName: req.body.displayName,
    email: req.body.email,
    password: req.body.password
  });
  user
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Created User',
        createdUser: user
      });
    })
    .catch((err) => {
      console.log(err);
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
