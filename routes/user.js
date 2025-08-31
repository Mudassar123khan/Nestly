const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//Router to render signup form
//Router  to signup a user
router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signUp));

//Router to render login form
//Router to login a user
router
  .route("/login")
  .get(userController.renderLoginPage)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  );

//Router to logout a user
router.get("/logout", userController.logout);

module.exports = router;
