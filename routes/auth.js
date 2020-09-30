const express = require("express");
const router = express.Router();

const User = require("../models/User");

const { signupValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");

router.post("/signup", async (req, res) => {
  const { error, value } = signupValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking user already exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exist");

  // generate and hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const user = await newUser.save();
    res.send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  const { error, value } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking user already exist
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email or Password is wrong");
});

module.exports = router;
