const express = require("express");
const router = express.Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  res.send({
    data: {
      title: "Hello world",
      body: "hello somebody guy, welcome back to my tutorial",
    },
  });
});

module.exports = router;
