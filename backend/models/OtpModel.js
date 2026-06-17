import mongoose, { model, Schema } from "mongoose";

const Otpschema = new Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
    },
   otp:{
    type:Number,
    required:true,
   },
   createdAt:{
    type:Date,
    default:Date.now,
    expires:300,
   }
   
})

const Otp = model('Otp',Otpschema)

export default Otp;