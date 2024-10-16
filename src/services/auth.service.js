import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import JWTService from "./JWT.service";
import { createToken } from "../middleware/JWTAction";
const crypto = require("crypto");
const {
  UnauthorizedResponse,
  ErrorResponse,
} = require("../core/error.response");

require("dotenv").config();
// Configurable salt rounds
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

// Hashes the password asynchronously
const hashUserPassword = async (userPassword) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(userPassword, salt);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

// Function to check both email and phone at once
const checkUserExists = async (userEmail, userPhone) => {
  const user = await db.User.findOne({
    where: {
      [Op.or]: [{ email: userEmail }, { phone: userPhone }],
    },
    raw: true,
  });
  return user;
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword);
};

// const forgetPassword = async (user) => {
//   console.log("TEST USER OUTPUT: ", user)

//   const token = crypto.randomBytes(20).toString("hex");
//     const resetToken = crypto
//       .createHash("sha256")
//       .update(token)
//       .digest("hex");
//     await db.update_forgot_password_token(user[0].id, resetToken);

//     const mailOption = {
//       email: user.email,
//       subject: "Forgot Password Link",
//       message: mailTemplate(
//         "We have received a request to reset your password. Please reset your password using the link below.",
//         `${process.env.FRONTEND_URL}/resetPassword?id=${user[0].id}&token=${resetToken}`,
//         "Reset Password"
//       ),
//     };
//     await sendEmail(mailOption);
//     res.json({
//       success: true,
//       message: "A password reset link has been sent to your email.",
//     });
// }

class AuthService {
  static register = async (rawUserData) => {
    try {
      // Step 1: Check email/phone number already existed
      let user = await checkUserExists(rawUserData.email, rawUserData.phone);
      if (user) {
        if (user.email === rawUserData.email) {
          return {
            EC: -1,
            EM: "The email is already existed!",
            DT: "email",
          };
        }
        if (user.phone === rawUserData.phone) {
          return {
            EC: -1,
            EM: "The phone number is already existed!",
            DT: "phone",
          };
        }
      }

      //Step 2: hash user password
      let hashPassword = await hashUserPassword(rawUserData.password);

      //Step 3: create new user
      await db.User.create({
        email: rawUserData.email,
        username: rawUserData.username,
        phone: rawUserData.phone,
        password: hashPassword,
        roleId: 4,
      });
      return {
        EM: "A user create successfully!",
        EC: 1,
        DT: "",
      };
    } catch (error) {
      console.log(error);
      return {
        EM: "Something wrong with user service!",
        EC: -1,
      };
    }
  };

  static login = async (rawUserData) => {
    try {
      let user = await checkUserExists(
        rawUserData.valueLogin,
        rawUserData.valueLogin
      );

      if (!user) {
        throw new UnauthorizedResponse({
          EM: "Your email/phone is incorrect",
        });
      }

      let checkPw = checkPassword(rawUserData.password, user.password);
      if (!checkPw) {
        throw new UnauthorizedResponse({
          EM: "Your password is incorrect",
        });
      }

      let roles = await JWTService.getRoleWithPermission(user);
      let payload = {
        roles,
        username: user.username,
        email: user.email,
      };

      let token = createToken(payload);
      return {
        EM: "Login successfully",
        EC: 1,
        DT: {
          accessToken: token,
          roles,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      console.log(">>> check error", error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something wrong with user service!",
      });
    }
  };
}

module.exports = AuthService;
