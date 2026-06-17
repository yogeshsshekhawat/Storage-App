import directory from "../models/directorymodel.js";
import Session from "../models/SessionModel.js";

const validate = async (req, res, next) => {
  const { id } = req.params;
  const { sid } = req.signedCookies;
  const sesion = await Session.findById(sid)
  const userid = sesion.userid;
  if(!userid){
    return res.status(400).json({ message: "authorized" });

  }
  if (id == "root") {
    next();
  }
  const vaildate = await directory.findOne({ _id: id, userid: userid }, "_id");
  if (validate) {
    next();
  } else {
    return res.status(400).json({ message: "authorized" });
  }
};

export default validate;
