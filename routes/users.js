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
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(201).json({
    message: 'Handling POST',
    createdUser: user
  });
});
/**************************************************************************/

/*GET all users ***********************************************************/
router.get('/', (req, res, next) => {
  User.find()
    .exec()
    .then((docs) => {
      console.log(docs);
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
