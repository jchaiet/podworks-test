const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let teamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  members: {
    type: Array
  }
},{
  timestamps: true,
  collection: 'teams'
})

module.exports = mongoose.model('Team', teamSchema);
