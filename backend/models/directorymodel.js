import { model, Schema } from "mongoose";

const directoryschema = new Schema({
    name:{
        type:String,
        required:true

    },
    parentid:{
        type:Schema.Types.ObjectId,
        
        default:null,

    },
    userid:{
        type:Schema.Types.ObjectId,
        required:true,
        
    }
})

const directory = model('directory',directoryschema)


export default directory;