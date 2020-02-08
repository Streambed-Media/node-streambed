const User = require('../models/user');
const bcrypt = require('bcrypt');
const client = require('../../../client');

/***USER CREATION,Currently hashes password using bcrypt, it also checks if email was used and wont let another user be created with the same email twice */
exports.user_sign_up = (req, res) => {
  const { displayName, email, password } = req.body;

  User.find({
    $or: [{ displayName: displayName }, { email: email }]
  })
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          error: 'Display name or email already exists'
        });
      } else {
        bcrypt.hash(password, 8, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              displayName: displayName,
              email: email,
              password: hash
            });
            req.session.userId = user._id;

            user
              .save()
              .then(() => {
                res.status(201).json({
                  success: 'User Created',
                  createdUser: user
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    })
    .catch();
};
/***User creation end*/

/***This is called after user is created without errors, it then stores the create wallet and pubKey */
exports.user_store_wallet_pub = async (req, res) => {
  try {
    const { mnemonic, pub } = req.body;
    console.log(req.session.userId);
    let user = await User.findOneAndUpdate(
      { _id: req.session.userId },
      { $set: { mnemonic: mnemonic, pub: pub } }
    );
    res.status(200).json({ msg: 'All Good!' });
  } catch (error) {
    console.error(error);
  }
};

/******Login GET */
exports.user_login_get = (req, res) => {
  const { userId } = req.session;

  // If session id doesn't exist skips redirects back to login page
  if (!userId) {
    res.redirect('/');
  } else {
    res.render('dashboard', { title: 'Streambed' });
  }
};
/****Login Get End */

/**Login POST */
exports.user_login_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ msg: 'Please enter correct credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ msg: 'Please enter correct credentials' });
    }
    if (req.body.remember) {
      req.session.cookie.maxAge = 20000000000; //If they want to be remembered, its set maxAge to a ~8 months
    }
    req.session.userId = user._id;
    res.status(200).json({ msg: 'this good', mnemonic: user.mnemonic });
  } catch (e) {
    console.log(e);
    res.redirect('/?error=' + e);
  }
};
/**Login POST End*/

/****Reset password */
/****Also set newly encrypted mnemoic with new pw as secret key */
exports.user_resetpw = (req, res) => {
  const pass = req.body.password;
  const mnemonic = req.body.encryption;
  console.log('Line 96 reset pw controller', mnemonic);
  bcrypt.hash(pass, 8, (err, hash) => {
    User.findOneAndUpdate(
      { _id: req.session.userId },
      { $set: { password: hash, mnemonic: mnemonic } }
    ).then(() => console.log(hash));
  });
};
/****Reset password End*/

//Retrieves the stored refreshToken and sets it in the client.js so the accessToken can be refreshed
/******Remember and rT GET */
exports.user_rt = async (req, res) => {
  try {
    const rememberInfo = await User.findOne(
      {
        _id: req.session.userId
      },
      ['rT']
    );
    let { rT } = rememberInfo;

    console.log('Line 131 in rt route', rT);
    client.refresh(req.session.userId, rT);
    const aT = await client.getNewAcc(req.session.userId);

    res.header('authorization', aT);
    res.status(200).render('dashboard');
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

/******Get rT value*/
exports.user_getrT = async (req, res) => {
  try {
    const remember = await User.findOne(
      {
        _id: req.session.userId
      },
      'rT'
    );
    const { rT } = remember;
    console.log('LINE 144 getrt', rT);
    res.status(201).json({
      rT
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
/****get rT Get End */

/****Delete rT from DB */
exports.user_deleterT = async (req, res) => {
  try {
    const { rt } = req.body;
    console.log(rt);
    console.log(req.session.userId);
    client.getOuttaHere(req.session.userId);
    const remember = await User.findOneAndUpdate(
      { _id: req.session.userId },
      { $set: { rT: '' } }
    );
    res.removeHeader('Authorization');
    res.status(201).json({
      msg: 'Signed out of Youtube'
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

/****End Delete rT from DB */

/******Get mnemonic from db*/
exports.user_getmnemonic = async (req, res) => {
  try {
    const remember = await User.findOne(
      {
        _id: req.session.userId
      },
      'mnemonic'
    );
    const { mnemonic } = remember;
    console.log('Line 177 getmnemonic controller', mnemonic);
    res.status(201).json({
      mnemonic
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
/****Get mnemonic from db End */

/**Fetch password to compare before reset */
exports.user_pw_compare = async (req, res) => {
  try {
    const { password } = req.body;
    console.log('IM HERE DAD', password);
    let user = await User.findOne(
      {
        _id: req.session.userId
      },
      ['password', 'mnemonic']
    );
    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(409).json({ msg: 'Incorrect Password' });
    }
    res.status(200).json({ msg: 'All Good!', mnemonic: user.mnemonic });
  } catch (e) {
    console.log(e);
  }
};
/**Fetch password to compare before reset End*/

/**Fetch pub */
exports.user_pub = async (req, res) => {
  try {
    console.log('IM HERE DAD', req.session.userId);
    let user = await User.findOne(
      {
        _id: req.session.userId
      },
      'pub'
    );
    res.status(201).json({ pub: user.pub });
  } catch (e) {
    console.log(e);
  }
};
/**Fetch pub */
