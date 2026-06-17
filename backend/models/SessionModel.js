import mongoose, { Schema } from "mongoose";

const Sessionschema = new Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        default:null
    }
})

const Session = mongoose.model('Session',Sessionschema);

export default Session;