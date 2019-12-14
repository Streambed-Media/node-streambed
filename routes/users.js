var express = require('express');
var router = express.Router();
const User = require('../task-manager/src/models/user.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  const user = new User(req.body)
  console.log(user)
  res.send(req.body)
});

module.exports = router;
