const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  purchase: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
}, { collection: 'purchases' });

module.exports = mongoose.model('Purchase', purchaseSchema);
