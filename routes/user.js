const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userContrller = require("../controllers/user.js");

router.get("/signup",userContrller.renderSignup);

//signup
router.post("/signup", wrapAsync(userContrller.signup));

router.get("/login",userContrller.renderLogin);

//login
router.post("/login", saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login", failureFlash: true}),userContrller.login);

router.get("/logout", userContrller.logout);

module.exports = router;