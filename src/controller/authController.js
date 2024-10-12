import AuthService from "../services/auth.service";
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

    if (data && +data.EC !== 1) {
      return res.status(401).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: "Error message from server", // error message
      EC: "-1", // Error code
      DT: "", // data
    });
  }
};

module.exports = {
  testApi,
  handleRegister,
  handleLogin,
};
