const mongoose = require('mongoose');
const validator = require('validator');

//User schema, all fields are required currently
const userSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!Brads code, NOT USING CURRENTLY --Tommy
/*
const User = mongoose.model('User', {
    description: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if( !validator.isEmail( value )) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    }
})
*/

module.exports = mongoose.model('User', userSchema);
