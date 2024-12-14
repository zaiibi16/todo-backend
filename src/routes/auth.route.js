const express = require("express");
const router = express.Router();
const { userCheck, authCheck } = require("../middleware");
const controller = require("../controllers/auth.controller");

// returns token
router.post("/login", controller.login);

router.post(
  "/register",
  [userCheck.checkDuplicateUsername],
  controller.register
);


router.get("/getUserData", [authCheck.verifyToken], controller.getUserData);

router.post("/logout", authCheck.verifyToken, (req, res) => {
  res.clearCookie("auth-token");
  return res.status(200).json({ success: true, data: {message: "User logged out successfully" }});
});

module.exports = router;
