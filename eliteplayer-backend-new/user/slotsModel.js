const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  courtId: {
  type: String,
  required: true
},
  playerId: { type: Number, required: true },
  slotTime: { type: Date, required: true },
  isBooked: { type: Boolean, default: false },
  sport: { type: String, required: true }
}, {
  collection: 'Slots' 
});

module.exports = mongoose.model('Slot', slotSchema);
