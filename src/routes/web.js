import express from "express";
import {
  getHomePage,
  getUserPage,
  postCreateUser,
  handleDeleteUser,
  getEditUserPage,
  handleEditUser,
} from "../controller/homeController";
import { testApi } from "../controller/authController";
import loginController from "../controller/loginController";
import passport from "passport";
import checkUser from "../middleware/checkUser";
import { handleLogout } from "../controller/passportController";

const router = express.Router();

router.get("/", checkUser.isLogin, getHomePage);
router.get("/user", getUserPage);
router.post("/user/create-user", postCreateUser);
router.post("/delete-user/:id", handleDeleteUser);
router.get("/user/update-user/:id", getEditUserPage);
router.post("/user/update-user", handleEditUser);
router.get("/api/test-api", testApi);
router.get("/login", checkUser.isLogin, loginController.getLoginPage);
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (error, user, info) {
    if (error) {
      return res.status(500).json(error);
    }
    if (!user) {
      return res.status(401).json(info.message);
    }
    req.login(user, function (err) {
      if (err) return next(err);

      return res
        .status(200)
        .json({ ...user, redirectURL: req.body.redirectURL });
    });
  })(req, res, next);
});

router.post("/logout", handleLogout);

router.post("/verify-token", loginController.verifySSOToken);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log(">>> checkout req.user", req.user);

    //save cookies

    return res.render("social.ejs", { ssoToken: req.user.code });
  }
);

//forgot password
router.get("/forgot-password", loginController.getForgotPasswordPage);
router.get("/verify-forgot-code", loginController.getVerifyForgotCodePage);
router.get("/reset-password", loginController.getResetPasswordPage);

router.post("/send-code", loginController.sendCode);
router.post("/verify-forgot-code", loginController.handleVerifyForgotCode);
router.post("/resend-code", loginController.resendCode);
router.post("/reset-password", loginController.handleResetPassword);

module.exports = router;
