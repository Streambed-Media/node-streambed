const mongoose = require('mongoose');
const validator = require('validator')

const connectionURL = 'mongodb+srv://brad:666darb666@cluster0-faeka.mongodb.net/'
const database = 'task-manager-api'

mongoose.connect(connectionURL+database, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true // Make sure indexes are created so we can make sure data is accessed
})

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

const me = new User({
    description: 'database testing',
    name: 'B-rad',
    email: 'mike@',
 
})

me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log('Error!', error)
})