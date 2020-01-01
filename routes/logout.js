const express = require('express');
const router = express.Router();


// router.post('/', (req, res) => {
//     console.log(req.session);
//     if (req.session) {
//         // delete session object
//         req.session.destroy(function (err) {
//             if (err) {
//                 return next(err);
//             } else {
//                 return res.redirect('/');
//             }
//         });
//     }

// });


router.post('/', (req, res) => {
    return res.redirect('/');
});



module.exports = router 