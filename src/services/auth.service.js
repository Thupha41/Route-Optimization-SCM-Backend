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
import { v4 as uuidv4 } from "uuid";

require("dotenv").config();
// Configurable salt rounds
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

class AuthService {
  // Hashes the password asynchronously
  static hashUserPassword = async (userPassword) => {
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
  static checkUserExists = async (userEmail, userPhone) => {
    const user = await db.User.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ email: userEmail }, { phone: userPhone }],
          },
          { typeLogin: "local" },
        ],
      },
      raw: true,
    });
    return user;
  };

  static checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
  };

  static register = async (rawUserData) => {
    try {
      // Step 1: Check email/phone number already existed
      let user = await this.checkUserExists(
        rawUserData.email,
        rawUserData.phone
      );
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
      let hashPassword = await this.hashUserPassword(rawUserData.password);

      //Step 3: create new user
      await db.User.create({
        email: rawUserData.email,
        username: rawUserData.username,
        phone: rawUserData.phone,
        password: hashPassword,
        roleId: 4,
      });
      return {
        EM: "A user was created successfully!",
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
      let user = await this.checkUserExists(
        rawUserData.valueLogin,
        rawUserData.valueLogin
      );

      if (!user) {
        throw new UnauthorizedResponse({
          EM: "Your email/phone is incorrect",
        });
      }

      let checkPw = this.checkPassword(rawUserData.password, user.password);
      if (!checkPw) {
        throw new UnauthorizedResponse({
          EM: "Your password is incorrect",
        });
      }
      const code = uuidv4();
      let roleWithPermission = await JWTService.getRoleWithPermission(user);
      let payload = {
        user_id: user.id,
        roleWithPermission,
        username: user.username,
        email: user.email,
        code: code,
      };

      let token = createToken(payload);
      return {
        EM: "Login successfully",
        EC: 1,
        DT: {
          user_id: user.id,
          access_token: token,
          roleWithPermission,
          username: user.username,
          email: user.email,
          code: code,
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
  static updateRefreshToken = async (email, refreshToken) => {
    try {
      await db.User.update(
        { refreshToken },
        { where: { email: email.trim() } }
      );
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

  static upsertUserGoogleLogin = async (typeLogin, rawData) => {
    try {
      let user = null;
      if (typeLogin === "google") {
        user = await db.User.findOne({
          where: { email: rawData.email, typeLogin: typeLogin },
          raw: true,
        });
        if (!user) {
          // Create a new account
          user = await db.User.create({
            email: rawData.email,
            username: rawData.username,
            typeLogin: typeLogin,
            roleId: 1,
          });
          user = user.get({ plain: true });
        }
        // Get role with permission
        const roleWithPermission = await JWTService.getRoleWithPermission(user);
        user.roleWithPermission = roleWithPermission;
      }
      return user;
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

  static getUserByRefreshToken = async (refreshToken) => {
    try {
      let user = await db.User.findOne({
        where: { refreshToken: refreshToken },
      });
      if (user) {
        let roleWithPermission = await JWTService.getRoleWithPermission(user);
        return {
          user_id: user.id,
          roleWithPermission,
          username: user.username,
          email: user.email,
        };
      }
      return null;
    } catch (error) {
      console.log(">>> check error", error);
      throw new ErrorResponse({
        EM: "Error getting user by refresh token",
      });
    }
  };
}

export default AuthService;
