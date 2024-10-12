import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import JWTService from "./JWT.service";
import { createToken } from "../middleware/JWTAction";
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

class AuthService {
  static register = async (rawUserData) => {
    try {
      // Step 1: Check email/phone number already existed
      let user = await checkUserExists(rawUserData.email, rawUserData.phone);
      if (user) {
        if (user.email === rawUserData.email) {
          return { EM: "The email is already existed!", EC: 0 };
        }
        if (user.phone === rawUserData.phone) {
          return { EM: "The phone number is already existed!", EC: 0 };
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
      if (user) {
        let checkPw = checkPassword(rawUserData.password, user.password);
        if (checkPw) {
          let roles = await JWTService.getRoleWithPermission(user);
          let payload = {
            roles,
            username: user.username,
            email: user.email,
          };
          console.log(">> check payload", payload);
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
        }
      }
      console.log(">>> Not found user with email/phone");
      return {
        EM: "Your email/phone or password is incorrect",
        EC: 0,
      };
    } catch (error) {
      console.log(error);
      return {
        EM: "Something wrong with user service!",
        EC: -1,
      };
    }
  };
}

module.exports = AuthService;
