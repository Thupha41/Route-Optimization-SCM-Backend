import passport from "passport";
import LocalStrategy from "passport-local";
import AuthService from "../services/auth.service";
const configPassport = () => {
  passport.use(
    new LocalStrategy({}, async (username, password, done) => {
      try {
        const rawData = {
          valueLogin: username,
          password: password,
        };
        const user = await AuthService.login(rawData);
        if (user && +user.EC === 1) {
          return done(null, user.DT);
        } else {
          return done(null, false, { message: user.EM });
        }
      } catch (error) {
        console.error("Login error:", error);
        return done(error);
      }
    })
  );
};

const handleLogout = (req, res) => {
  //   req.logout();
  //   res.redirect("/login");

  req.session.destroy(function (err) {
    req.logout();
    res.redirect("/");
  });
};

export { configPassport, handleLogout };
