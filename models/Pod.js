const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let podSchema = new Schema({
  date: {
    type: String
  },
  members: {
    type: Array
  },
  company: {
    type: String
  }
},{
  timestamps: true,
  collection: 'pod'
})

module.exports = mongoose.model('Pod', podSchema);
