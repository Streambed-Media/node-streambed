var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../task-manager/src/middleware/check-auth');
const UsersController = require('../task-manager/src/controller/users');

/**Put you DB path here, you can use this default path to host it local at this address */
// mongoose.connect('mongodb://localhost/test', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true
// });

/*POST user signup, posting to /users/signup with json will create entry in DB */
router.post('/signup', UsersController.user_sign_up);
/**************************************************/

/*POST to login exsiting user********************/
router.post('/login', UsersController.user_login);

/************************************************/

/*GET all displayNames! ***************************/
router.get('/', UsersController.user_display_names);
/*************************************************/

module.exports = router;
