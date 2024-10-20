const { OK } = require("../core/success.response");
import { v4 as uuidv4 } from "uuid";
import AuthService from "../services/auth.service";
import { createToken } from "../middleware/JWTAction";
import { UnauthorizedResponse } from "../core/error.response";
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
        maxAge: 15 * 60 * 1000,
      });

      const resData = {
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
      return new UnauthorizedResponse({
        EM: "Not match sso token",
        DT: "",
      }).send(res);
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

module.exports = {
  getLoginPage,
  verifySSOToken,
};
