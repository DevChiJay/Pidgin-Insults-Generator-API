const mongoose = require('mongoose');

const InsultSchema = new mongoose.Schema(
  {
    title: String,
    status: String,
  },
  { collection: 'insults' }
);

module.exports = mongoose.model('Insult', InsultSchema);
