import user from "../models/UserModel.js"
import mongoose from "mongoose";
import { getCachedSession } from "../config/redisService.js";

const userauth = async (req,res,next)=>{
  
    const {sid:id} = req.signedCookies;
    if (!id) {
      return res.status(401).json({ error: "no ID founded" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID " });
    }
    const data = await getCachedSession(id);
    if(data){
        req.session = data;
        // Process pending downgrades if they are due
        try {
          const usertocheck = await user.findById(data.userid);
          if (usertocheck && usertocheck.downgradeAt && new Date() >= usertocheck.downgradeAt) {
            await user.findByIdAndUpdate(data.userid, {
              plan: usertocheck.pendingPlan,
              downgradeAt: null,
              pendingPlan: null
            });
          }
        } catch (err) {
          console.error("Error processing pending downgrade check:", err);
        }
        next();
    }
    else{
        return res.status(400).json({ error: "Invalid ID" });
    }
}

export default userauth;