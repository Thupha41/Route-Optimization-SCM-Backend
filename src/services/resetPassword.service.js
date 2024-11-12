import db from "../models/index";
import { ErrorResponse } from "../core/error.response";
import AuthService from "./auth.service";
class ResetPasswordService {
  // Mark the reset token as expired
  static markTokenAsExpired = async (tokenId) => {
    try {
      await db.ResetPasswordToken.update(
        { expired: true },
        { where: { id: tokenId } }
      );
    } catch (error) {
      console.error(">>> markTokenAsExpired error:", error);
      throw new ErrorResponse({
        EM: "Something wrong with reset password service!",
      });
    }
  };

  //when user change password, mark the token as consumed
  static markTokenAsConsumed = async (tokenId) => {
    try {
      await db.ResetPasswordToken.update(
        {
          consumed: true,
          verifyToken: null, // Clear the verifyToken
        },
        { where: { id: tokenId } }
      );
    } catch (error) {
      console.error(">>> markTokenAsConsumed error:", error);
      throw new ErrorResponse({
        EM: "Something wrong with reset password service!",
      });
    }
  };

  // Update or create reset password token for the user
  static updateUserVerifyCode = async (userID, verifyCode) => {
    try {
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 2);

      // Check if a reset password token already exists for this user
      let existingToken = await db.ResetPasswordToken.findOne({
        where: { userID },
      });

      if (existingToken) {
        await db.ResetPasswordToken.update(
          {
            verifyToken: verifyCode,
            expirationDate: expirationDate,
            consumed: false,
            expired: false,
          },
          { where: { userID } }
        );
      } else {
        // Create a new token if none exists
        await db.ResetPasswordToken.create({
          userID: userID,
          verifyToken: verifyCode,
          expirationDate: expirationDate,
          consumed: false,
          expired: false,
        });
      }
    } catch (error) {
      console.error(">>> updateResetPasswordToken error:", error);
      throw new ErrorResponse({
        EM: "Something wrong with reset password service!",
      });
    }
  };

  static isEmailLocal = async (email) => {
    try {
      const user = await db.User.findOne({
        where: { email: email, typeLogin: "local" },
      });
      return user ? user : null;
    } catch (error) {
      console.log(">>> check error", error);
      return null;
    }
  };
  static isVerifyCode = async (code) => {
    try {
      const resetToken = await db.ResetPasswordToken.findOne({
        where: {
          verifyToken: code,
          consumed: false,
          expired: false,
        },
      });
      return resetToken;
    } catch (error) {
      console.error(">>> isVerifyCode error:", error);
      throw new ErrorResponse({
        EM: "Something went wrong with verifying the code.",
      });
    }
  };

  static resetPassword = async (email, newPassword) => {
    try {
      const resetToken = await db.ResetPasswordToken.findOne({
        where: {
          expired: false,
          consumed: false,
        },
        include: [
          {
            model: db.User,
            where: { email: email.trim(), typeLogin: "local" },
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (!resetToken) {
        throw new ErrorResponse({
          EM: "Invalid or expired reset token.",
        });
      }

      // Hash the new password
      let hashedPassword = await AuthService.hashUserPassword(newPassword);

      await db.sequelize.transaction(async (t) => {
        // Update the password
        const [updated] = await db.User.update(
          { password: hashedPassword },
          {
            where: { email: email.trim(), typeLogin: "local" },
            transaction: t,
          }
        );

        if (updated === 0) {
          throw new ErrorResponse({
            EM: "Failed to update password. Please try again.",
          });
        }

        // Mark the token as consumed and clear the verifyToken
        await db.ResetPasswordToken.update(
          {
            consumed: true,
            verifyToken: null,
            expirationDate: new Date(),
          },
          {
            where: { id: resetToken.id },
            transaction: t,
          }
        );
      });

      return {
        EM: "Password updated successfully.",
      };
    } catch (error) {
      console.error(">>> resetPassword error:", error);
      throw new ErrorResponse({
        EM: error.message || "Something went wrong with resetting password.",
      });
    }
  };
}

export default ResetPasswordService;
