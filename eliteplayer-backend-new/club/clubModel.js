const mongoose = require('mongoose');

const addressSchema=new mongoose.Schema({
  pincode:{type:Number,required:true},
  state:{type:String,required:true},
  city:{type:String,required:true},
  locality:{type:String,required:true},
  dno:{type:String}
})

const clubSchema=mongoose.Schema({
  userName:{type:String,required:true},
  spoc:{type:String,required:true},
  address:{type:addressSchema,required:true},
  email:{type:String,required:true},
  membership:{type:String,enum:['Gold','Silver','Bronze'],required:true},
  mobileNumber:{type:Number,required:true},
  referral:{type:String}
})

module.exports = mongoose.model('Club',clubSchema);