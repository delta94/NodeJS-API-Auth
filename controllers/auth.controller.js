const jwt = require("jsonwebtoken");
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const { signupValidation, loginValidation } = require("../validation");
let tokenList = [];

module.exports.index = (req, res) => {
  res.send({
    data: {
      title: "Hello world",
      body: "hello somebody guy, welcome back to my tutorial",
    },
  });
};

module.exports.signup = async (req, res) => {
  const { error, value } = signupValidation(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  // Checking user already exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).json({ err: "Email đã tồn tại." });

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
};

module.exports.login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0]);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ err: "Email không tồn tại." });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({ err: "Mật khẩu không đúng." });
  }

  const accessToken = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 15 * 60,
    },
    "access"
  );
  const refreshToken = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    "refresh"
  );
  tokenList.push(refreshToken);

  res.header("access-token", accessToken).json({ accessToken, refreshToken });
};

module.exports.refresh_token = (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken && tokenList.includes(refreshToken)) {
    jwt.verify(refreshToken, "refresh", (err, user) => {
      if (!err) {
        const accessToken = jwt.sign(
          {
            _id: user._id,
            name: user.name,
            exp: Math.floor(Date.now() / 1000) + 15 * 60,
          },
          "access"
        );
        res.json({ accessToken });
      } else {
        res.status(400).json({ err: "Bạn cần phải đăng nhập." });
      }
    });
  } else {
    res.status(400).json({ err: "Bạn cần phải đăng nhập." });
  }
};
