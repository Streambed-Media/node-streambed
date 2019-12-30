var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../task-manager/src/models/user');
const checkAuth = require('../task-manager/src/middleware/check-auth');
const UsersController = require('../task-manager/src/controller/users');

/**Put you DB path here, you can use this default path to host it local at this address */
mongoose.connect('mongodb+srv://brad:666darb666@cluster0-faeka.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

router.get('/login', (req,res) => {
    res.render('dashboard')
})

/*POST user signup, posting to /users/signup with json will create entry in DB */
router.post('/signup', UsersController.user_sign_up);
// router.post('/signup', async (req, res) => {
//     const data = req.body

//     console.log('data',data) 
    // res.send(data)
    // const user = new User({
    //     displayName: req.body.displayName,
    //     email: req.body.email[0],
    //     password: req.body.password[0]
    // })
    // const user = await User.findByCredentials(req.body.email, req.body.password ).then((user) => {
    //     if(!user){
    //         return console.log('user signup error: ', user)
    //     }
    //     console.log('user signup: ', user)
//    res.render('dashboard')
    //     // res.send(404)
    //     res.send('there is an error')
    // const user = await User.findByCredentials(req.body.email, req.body.password )
    // res.redirect('/')
    // }).catch((err)=> {
    //     console.log('the error',err)
    //     res.send(err)
    // })
    
    //Going to save the token to database from the method
    // const token = await user.generateAuthToken()
    
    // user.save().then((users) => {
    //     console.log('users',users)
    //     res.status(201).render('dashboard')
    // }).catch((err)=> {
    //     console.log(err)
    // })
  
// });

// router.get('/signup', async (req, res) =>{
//     const user = await User.find({})
//     console.log('users signup ', user)
//     // res.render('dashboard')
//     res.send(user)
//     // res.redirect('/users/signup')
// })
/**************************************************/

/*POST to login exsiting user********************/
router.post('/login', UsersController.user_login);
// router.post('/login', async (req, res) => {
//     try {
//         const user = await User.findByCredentials(req.body.password[0], req.body.email[0])
//         const token = await User.generateAuthToken()
        
//         res.send({user, token})
//     }catch(e) {
//         res.status(400).send()
//     }
   
// });

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'somepassword')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

/************************************************/

/*GET all displayNames! ***************************/
router.get('/', UsersController.user_display_names);
/*************************************************/






module.exports = router;
