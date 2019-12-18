// //!!!! NOT USING CURRENTLY --Tommy

// const mongoose = require('mongoose');
// const validator = require('validator');

// const connectionURL = `mongodb+srv://streambed:<${process.env.MONGO_ATLAS_PW}>@project-cluster-xpyv1.mongodb.net/test?retryWrites=true&w=majority`;
// //const database = 'task-manager-api';

// mongoose.connect(connectionURL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

//! Brads code, commenting out while testing
// const User = mongoose.model('User', {
//   description: {
//     type: String
//   },
//   name: {
//     type: String
//   },
//   email: {
//     type: String,
//     required: true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error('Email is invalid');
//       }
//     }
//   },
//   age: {
//     type: Number,
//     validate(value) {
//       if (value < 0) {
//         throw new Error('Age must be a positive number');
//       }
//     }
//   }
// });

// const me = new User({
//   description: 'database testing',
//   name: 'B-rad',
//   email: 'mike@'
// });

// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch((error) => {
//     console.log('Error!', error);
//   });
