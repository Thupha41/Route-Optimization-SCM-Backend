import jwt from "jsonwebtoken";
require("dotenv").config();

let key = process.env.JWT_SECRET;
const nonSecurePaths = ["/logout", "/register", "/login"];
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
    console.log(error);
  }
  return decoded;
};

const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();

  //extract token from header
  const tokenFromHeader = extractToken(req);
  let cookies = req.cookies;
  if ((cookies && cookies.access_token) || tokenFromHeader) {
    let access_token =
      cookies && cookies.access_token ? cookies.access_token : tokenFromHeader;
    let decoded = verifyToken(access_token);
    if (decoded) {
      decoded.access_token = access_token;
      decoded.refresh_token = cookies.refresh_token;
      req.user = decoded;
      console.log(">>> check user", req.user);
      next();
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
      return res.status(403).json({
        EC: -1,
        EM: "You don't have any permissions assigned!",
        DT: "",
      });
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
    return res.status(401).json({
      EC: -1,
      EM: "User not authenticated",
      DT: "",
    });
  }
};

module.exports = {
  createToken,
  verifyToken,
  checkUserJWT,
  checkUserPermission,
};
