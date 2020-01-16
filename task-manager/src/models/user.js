const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//User schema, all fields are required currently
//TODO Not sure how to store access token for google yet, still thinking of solutions
const userSchema = new mongoose.Schema({
  displayName: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ //This is regex for email validation
  },
  password: { type: String, required: true }
  // googleAccessToken: { type: String, required: true }
});

userSchema.statics.findByCredentials = async (email, password) => {

  const user = await User.findOne({ email })

  if (!user) {
      throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
      throw new Error('Unable to login')
  }

  return user
}


const User = mongoose.model('User', userSchema);

module.exports = User;
