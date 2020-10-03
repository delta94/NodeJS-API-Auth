const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("access-token");
  if (!token) {
    return res.send({ err: "Truy cập không thành công." });
  }

  jwt.verify(token, "access", (err, user) => {
    if (!err) {
      req.user = user;
      next();
    } else {
      res.send({ err: "Mã không hợp lệ." });
    }
  });
};
