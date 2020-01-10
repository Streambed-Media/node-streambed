const express = require('express');
const router = express.Router();

//! Need this to clear youtube Oauth session, not working currently
// router.post('/', (req, res) => {
//   console.log(req);
//   req.session.destroy((err) => {
//     //res.clearCookie(SESS_NAME);
//     return res.redirect('/');
//   });
// });

module.exports = router;
