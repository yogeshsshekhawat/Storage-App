import Session from "../models/SessionModel.js";
import user from "../models/UserModel.js"
import mongoose from "mongoose";

const userauth = async (req,res,next)=>{
  
    const {sid:id} = req.signedCookies;
    if (!id) {
      return res.status(401).json({ error: "no ID founded" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID " });
    }
    const data = await Session.findById(id);
    if(data){
        next()
    }
    else{
        return res.status(400).json({ error: "Invalid ID" });
    }
}

export default userauth;