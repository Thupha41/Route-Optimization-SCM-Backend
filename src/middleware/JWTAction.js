import jwt from "jsonwebtoken";
require("dotenv").config();
import { v4 as uuidv4 } from "uuid";
import AuthService from "../services/auth.service";
let key = process.env.JWT_SECRET;
const nonSecurePaths = [
  "/logout",
  "/register",
  "/login",
  "/verify-services-jwt",
  "/procurement-plan/search",
  "/procurement-plan/filter",
];
const createToken = (payload) => {
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRES_IN });
  } catch (error) {
    console.log(error);
  }

  return token;
};

const verifyToken = (token) => {
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return "Token expired error";
    }
  }
  return decoded;
};

const checkUserJWT = async (req, res, next) => {
  if (nonSecurePaths.includes(req.path) || req.query.searchQuery) return next();

  //extract token from header
  const tokenFromHeader = extractToken(req);
  let cookies = req.cookies;
  if ((cookies && cookies.access_token) || tokenFromHeader) {
    let access_token =
      cookies && cookies.access_token ? cookies.access_token : tokenFromHeader;
    let decoded = verifyToken(access_token);
    console.log(">>> check decoded", decoded);
    if (decoded && decoded !== "Token expired error") {
      decoded.access_token = access_token;
      decoded.refresh_token = cookies.refresh_token;
      req.user = decoded;
      // console.log(">>> check user", req.user);
      next();
    } else if (decoded && decoded === "Token expired error") {
      // handle refresh token
      if (cookies && cookies.refresh_token) {
        let generateNewToken = await handleRefreshToken(cookies.refresh_token);
        let newAccessToken = generateNewToken.newAccessToken;
        let newRefreshToken = generateNewToken.newRefreshToken;
        //set cookies
        if (newAccessToken && newRefreshToken) {
          res.cookie("refresh_token", newRefreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 1000,
          });
          res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
          });
        }
        return res.status(405).json({
          EC: -1,
          EM: "Need to retry with new token",
          DT: "",
        });
      } else {
        return res.status(401).json({
          EC: -1,
          EM: "User not authenticated",
          DT: "",
        });
      }
    } else {
      return res.status(401).json({
        EC: -1,
        EM: "User not authenticated",
        DT: "",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      EM: "User not authenticated",
      DT: "",
    });
  }
};
const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};
const checkUserPermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.path) || req.path === "/account") {
    return next();
  }

  if (req.user) {
    const { roleWithPermission } = req.user;
    const currentPath = req.path;
    console.log("Current Path:", currentPath);

    if (
      !roleWithPermission.Permissions ||
      roleWithPermission.Permissions.length === 0
    ) {
      throw new ForbiddenResponse("You don't have any permissions assigned!");
    }

    // Remove the ID from the current path for comparison
    const currentPathWithoutId = currentPath.replace(/\/\d+/g, "");
    console.log("Current Path Without ID:", currentPathWithoutId);
    const canAccess = roleWithPermission.Permissions.some((permission) => {
      const permissionPath = permission.url.toLowerCase();
      console.log("Comparing with:", permissionPath);

      return currentPathWithoutId.toLowerCase().startsWith(permissionPath);
    });

    if (canAccess) {
      next();
    } else {
      return res.status(403).json({
        EC: -1,
        EM: "You don't have permission to access this resource!",
        DT: "",
      });
    }
  } else {
    // throw new UnauthorizedResponse("User not authenticated");
    return res.status(401).json({
      EC: -1,
      EM: "User not authenticated",
      DT: "",
    });
  }
};

const handleRefreshToken = async (refreshToken) => {
  let newAccessToken = "";
  let newRefreshToken = "";
  //get user by refresh token
  let user = await AuthService.getUserByRefreshToken(refreshToken);
  if (user) {
    let payloadAccessToken = {
      user_id: user.user_id,
      roleWithPermission: user.roleWithPermission,
      username: user.username,
      email: user.email,
    };

    newAccessToken = createToken(payloadAccessToken);
    newRefreshToken = uuidv4();

    //update user with new refresh token
    await AuthService.updateRefreshToken(user.email, newRefreshToken);
  }
  return {
    newAccessToken,
    newRefreshToken,
  };
};

module.exports = {
  createToken,
  verifyToken,
  checkUserJWT,
  checkUserPermission,
};
