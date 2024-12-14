const db = require("../models");
const User = db.user;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const givenUsername = req.body.username;
    const givenPass = req.body.password;
    if (givenUsername && givenPass) {
      const user = new User({
        username: givenUsername,
        password: bcrypt.hashSync(givenPass, 8),
      });
      await user.save();
      res.send({ success: true, data: {message: "User registered successfully!" }});
    } else {
      res.status(500).send({ message: "Missing info given" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.userId).exec();
    res.send({ success: true, data: {username: user.username}});
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username }).exec();
    if (!user) {
      return res.status(200).send({
        success: false,
        error: {
          message: "Invalid username and password combination.",
        }
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(200).send({
        success: false,
        error: {
          message: "Invalid username and password combination.",
        }
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN, {
      expiresIn: "1m", // 24 hours
    });

    res.status(200).send({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        accessToken: token,
      }
    });
  } catch (err) {
    next(err);
  }
};
