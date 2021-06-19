const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subSchema = new Schema({
  date: {
    type: String
  },
  members: {
    type: Array
  }
})

let weekSchema = new Schema({
  first_day: {
    type: String,
    required: true
  },
  last_day: {
    type: String,
    required: true
  },
  days: [subSchema],
},{
  timestamps: true,
  collection: 'weeks'
})

module.exports = mongoose.model('Week', weekSchema);
