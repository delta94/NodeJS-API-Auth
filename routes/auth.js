const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");
const verify = require("../controllers/verifyToken");

router.get("/user", verify, controller.index);

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.post("/refresh-token", controller.refresh_token);

module.exports = router;
