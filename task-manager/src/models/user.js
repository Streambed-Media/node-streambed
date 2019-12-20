const mongoose = require('mongoose');
const validator = require('validator');

//User schema, all fields are required currently
//TODO Not sure how to store access token for google yet, still thinking of solutions
const userSchema = new mongoose.Schema({
  displayName: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ //This is regex for email validation
  },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
