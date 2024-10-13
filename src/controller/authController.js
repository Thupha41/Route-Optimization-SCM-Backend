import AuthService from "../services/auth.service";
import { OK, CREATED, NO_CONTENT } from "../core/success.response";
import { ErrorResponse } from "../core/error.response";
const testApi = (req, res) => {
  res.status(200).json({
    message: "ok",
    data: "test api",
  });
};

const handleRegister = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    if (!email || !phone || !password) {
      return res.status(400).json({
        EM: "Missing required parameter", // error message
        EC: "0", // Error code
        DT: "", // data
      });
    }
    if (password && password.length < 4) {
      return res.status(400).json({
        EM: "Password must be longer than 3 characters", // error message
        EC: "0", // Error code
        DT: "", // data
      });
    }
    // Service: create user
    let data = await AuthService.register(req.body);
    console.log(">>> check response code", data.EC);
    // Respond with the error or success message from AuthService
    return res.status(200).json({
      EM: data.EM, // error or success message
      EC: data.EC, // Error code
      DT: data.DT, // data
    });
  } catch (error) {
    console.error("Error in handleRegister:", error);
    return res.status(500).json({
      EM: "Error message from server", // error message
      EC: "-1", // Error code
      DT: "", // data
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    let data = await AuthService.login(req.body);

    if (data && data.DT && data.DT.accessToken) {
      res.cookie("jwt", data.DT.accessToken, { httpOnly: true });
    }

    return new OK({
      EM: data.EM,
      DT: data.DT,
    }).send(res);
  } catch (error) {
    console.error("Error in handleLogin:", error);

    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    return new ErrorResponse({
      EM: "Error message from server",
    }).send(res);
  }
};

const handleLogout = (req, res) => {
  try {
    res.clearCookie("jwt");
    return new OK({
      EM: "Clear cookies successfully",
    }).send(res);
  } catch (error) {
    console.error(error);
    return new ErrorResponse({
      EM: "Error message from server",
    }).send(res);
  }
};

module.exports = {
  testApi,
  handleRegister,
  handleLogin,
  handleLogout,
};
