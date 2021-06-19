const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let companySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  domains: {
    type: Array,
    required: true
  },
  teams: {
    type: Array
  },
  members: {
    type: Array
  },
  limit: {
    type: Number
  },
  seats: {
    limited: {
      type: Boolean
    },
    amount: {
      type: Number
    }
  }
},{
  timestamps: true,
  collection: 'companies'
})

module.exports = mongoose.model('Company', companySchema);
