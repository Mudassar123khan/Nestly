const User = require("../models/user");
module.exports.renderSignUpForm =  (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ email, username });
      let registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Imperial Hotels!");
        return res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLoginPage =  (req, res) => {
  res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    let { username, password } = req.body;
    req.flash("success", `Welcome, ${username}`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.logout =  (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
}
