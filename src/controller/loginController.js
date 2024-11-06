const { OK } = require("../core/success.response");
import { v4 as uuidv4 } from "uuid";
import AuthService from "../services/auth.service";
import ResetPasswordService from "../services/resetPassword.service";
import nodemailer from "nodemailer";
import { createToken } from "../middleware/JWTAction";
import {
  UnauthorizedResponse,
  ErrorResponse,
  BadRequestResponse,
} from "../core/error.response";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
const getLoginPage = (req, res) => {
  const { serviceURL } = req.query;
  return res.render("login.ejs", {
    redirectURL: serviceURL,
  });
};

const verifySSOToken = async (req, res) => {
  try {
    const { ssoToken } = req.body;
    if (req.user && req.user.code && req.user.code === ssoToken) {
      const refreshToken = uuidv4();

      //update user refresh token
      await AuthService.updateRefreshToken(req.user.email, refreshToken);

      let payload = {
        user_id: req.user.user_id,
        roleWithPermission: req.user.roleWithPermission,
        username: req.user.username,
        email: req.user.email,
      };

      let token = createToken(payload);

      //set cookies
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1000,
      });
      res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });

      const resData = {
        user_id: req.user.user_id,
        access_token: token,
        refresh_token: refreshToken,
        email: req.user.email,
        username: req.user.username,
        roleWithPermission: req.user.roleWithPermission,
      };

      //destroy session
      req.session.destroy(function (err) {
        req.logout();
      });

      return new OK({
        EM: "Verify token successfully",
        DT: resData,
      }).send(res);
    } else {
      throw new UnauthorizedResponse({
        EM: "Not match sso token",
        DT: "",
      });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    return new ErrorResponse({
      EM: "Error verifying SSO token from server",
    }).send(res);
  }
};

const getForgotPasswordPage = (req, res) => {
  return res.render("forgot-password.ejs");
};
const getVerifyForgotCodePage = (req, res) => {
  return res.render("verify-forgot-code.ejs");
};
const getResetPasswordPage = (req, res) => {
  return res.render("reset-password.ejs");
};

const sendCode = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the system
    let user = await ResetPasswordService.isEmailLocal(email);
    if (!user) {
      return new UnauthorizedResponse({
        EM: `Email ${email} not found`,
      }).send(res);
    }

    // Store the email in session
    req.session.forgotPasswordEmail = email;

    // Generate OTP (6-digit code)
    const OTP = Math.floor(100000 + Math.random() * 900000);

    // Prepare the email with OTP
    const filePath = path.join(__dirname, "../templates/reset-password.html");
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = {
      email: email,
      OTP: OTP,
    };
    const htmlToSend = template(replacements);

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    console.log(">>> start sending email");

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Reset Password SSO EFFIE ROUTE" <${process.env.GOOGLE_APP_EMAIL}>`,
      to: `${email}`,
      subject: "Reset Password SSO EFFIE ROUTE",
      html: htmlToSend,
    });

    console.log(">>> end sending email");
    console.log("info", info);

    // Insert or update ResetPasswordToken for the user
    await ResetPasswordService.updateUserVerifyCode(user.id, OTP);

    return new OK({
      EM: "Code sent successfully",
      DT: { email },
    }).send(res);
  } catch (error) {
    console.log(">>> sendCode error:", error);
    return new ErrorResponse({
      EM: "Error sending reset code. Please try again.",
    }).send(res);
  }
};

const handleVerifyForgotCode = async (req, res) => {
  try {
    const { code } = req.body;

    // Check code valid
    const isCodeValid = await ResetPasswordService.isVerifyCode(code);

    if (!isCodeValid) {
      return new BadRequestResponse({
        EM: "Invalid code. Please try again.",
      }).send(res);
    }

    // Check if the token has expired
    const now = new Date();
    if (now > isCodeValid.expirationDate) {
      // Update the expired column to true
      await ResetPasswordService.markTokenAsExpired(isCodeValid.id);

      return new BadRequestResponse({
        EM: "Token has expired. Please request a new one.",
      }).send(res);
    }

    // If the token is valid, proceed with resetting the password
    return new OK({
      EM: "Code verified successfully",
    }).send(res);
  } catch (error) {
    console.error("Error in handleVerifyForgotCode:", error);
    return new ErrorResponse({
      EM: "Error verifying reset code",
    }).send(res);
  }
};

const resendCode = async (req, res) => {
  try {
    const email = req.session.forgotPasswordEmail;
    console.log(">>> email", email);
    console.log(">>> check session", req.session);
    if (!email) {
      return new ErrorResponse({
        EM: "Email not found. Please start the forgot password process again.",
      }).send(res);
    }

    // Generate a new OTP
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const filePath = path.join(__dirname, "../templates/reset-password.html");
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = {
      email: email,
      OTP: OTP,
    };
    const htmlToSend = template(replacements);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Reset Password SSO EFFIE ROUTE" <${process.env.GOOGLE_APP_EMAIL}>`,
      to: email,
      subject: "Resend Password Reset Code",
      html: htmlToSend,
    });

    // Update OTP in db
    // Update OTP in the database
    const user = await ResetPasswordService.isEmailLocal(email);
    await ResetPasswordService.updateUserVerifyCode(user.id, OTP);

    return new OK({
      EM: "Code resent successfully",
    }).send(res);
  } catch (error) {
    console.error("Error in resendCode:", error);
    return new ErrorResponse({
      EM: "Error resending code",
    }).send(res);
  }
};

const handleResetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const email = req.session.forgotPasswordEmail; // Get email from session

    if (!email) {
      return new ErrorResponse({
        EM: "Email not found. Please start the forgot password process again.",
        EC: -1,
      }).send(res);
    }

    if (newPassword !== confirmPassword) {
      return new BadRequestResponse({
        EM: "Passwords do not match.",
        EC: -1,
      }).send(res);
    }

    await ResetPasswordService.resetPassword(email, newPassword);

    // Clear the session data after successful password reset
    delete req.session.forgotPasswordEmail;
    delete req.session.codeVerified;

    return new OK({
      EM: "Password reset successfully",
      EC: 0,
    }).send(res);
  } catch (error) {
    console.error("Error in handleResetPassword:", error);
    return new ErrorResponse({
      EM: error.message || "Error resetting password",
      EC: -1,
    }).send(res);
  }
};

module.exports = {
  getLoginPage,
  verifySSOToken,
  getForgotPasswordPage,
  getVerifyForgotCodePage,
  getResetPasswordPage,
  sendCode,
  handleVerifyForgotCode,
  resendCode,
  handleResetPassword,
};
