const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const sportSchema = new mongoose.Schema({
  sportName: { type: String, required: true },
});

const subscriptionPlanSchema = new mongoose.Schema({
  planId: { type: Number, required: true },
  planStatus: { type: String, enum: ['active', 'inActive'], required: true },
  subscriptionEnding: { type: Date, required: true },
  clubId: { type: Number, required: true },
  paymentRefNumber: { type: String, required: true }
});

const holdSchema = new mongoose.Schema({
  status : {type:Boolean,required:true,default:false},
  onHoldMessage : {type:String}
});

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    primaryPhoneNumber: { type: Number, required: true },
    secondaryPhoneNumber: { type: Number },
    address: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    primaryEmail: { type: String, required: true, unique: true },
    secondaryEmail: { type: String },
    referalId: { type: String, unique: true },
    userType: {
      type: String,
      enum: ['member', 'visitor', 'coach', 'admin'],
      required: true,
    },
    status: { type: String, enum: ['active', 'inActive'], default: 'active' },
    sport: { type: [sportSchema], required: true },
    subscriptionPlan: { type: [subscriptionPlanSchema] },
    rating: { type: Number },
    clubId: { type: Number, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'prefer not to say'],
      required: true,
    },
    joinedAt: { type: Date, default: Date.now },
    role: { type: String },
    isWelcome:{type:Boolean,default:false},
    isOnHold:{type:holdSchema,required:true},
    keycloakToken: { type: String },
  },
  { collection: 'users', timestamps: true }
);

userSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 1 });

module.exports = mongoose.model('User', userSchema);
