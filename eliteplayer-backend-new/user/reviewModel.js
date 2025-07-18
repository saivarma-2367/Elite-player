const mongoose=require('mongoose');

const reviewSchema = mongoose.Schema({
  reviewedBy:{type:Number,required:true},
  reviewedOn:{type:Number,required:true},
  content:{type:String,required:true},
  status:{type:String,required:true,enum:['on','off']}
})

module.exports =mongoose.model('Review',reviewSchema);