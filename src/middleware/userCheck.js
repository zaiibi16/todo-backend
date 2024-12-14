const db = require("../models");
const User = db.user;

const checkDuplicateUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(200).send({
        success: false,
        error: {
          message: "Username is already in use!",
        }
      });
    }
    next();
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};


const userCheck = {
  checkDuplicateUsername,
};
module.exports = userCheck;
