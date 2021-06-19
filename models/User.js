const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  full_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  company: {
    type: String,
  },
  role: {
   type: String
  },
  avatar: {
    data: Buffer,
    type: String
  }
},{
  timestamps: true,
  collection: 'users'
})

module.exports = mongoose.model('User', userSchema);