const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  membershipValidTill: { type: Date, default: null },
  email:{type:String}
}, { _id: false });

const partnerSchema = new mongoose.Schema({
  initiatedBy: {
    type: userSchema,
    required: true
  },
  acceptedBy: {
    type: [userSchema],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
