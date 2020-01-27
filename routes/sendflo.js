const express = require('express');
const router = express.Router();
const sendFloData = require('../task-manager/src/middleware/sendFlo.js').sendFlo;


router.post('/', (req, res) => {
    let signed64 = req.body.signed64
    console.log('signed64', signed64)
    console.log(signed64)
    sendFloData( signed64 )
        .then(( txid )=>{
            console.log(txid)
            res.status(201).json({
                txid: txid
            });
        })
    .catch((err)=> console.log('Catch error' , err))
});

module.exports = router;
