import UserService from "../services/user.service";

const getListUser = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let users = await UserService.getUserWithPagination(+page, +limit);
      return res.status(200).json({
        EM: users.EM, // error or success message
        EC: users.EC, // Error code
        DT: users.DT, // data
      });
    } else {
      let users = await UserService.getAll();
      return res.status(200).json({
        EM: users.EM, // error or success message
        EC: users.EC, // Error code
        DT: users.DT, // data
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error message from server", // error message
      EC: "-1", // Error code
      DT: "", // data
    });
  }
};
const createUser = async (req, res) => {
  try {
    const result = await UserService.create(req.body);
    if (result.EC === 1) {
      return res.status(201).json({
        EM: result.EM,
        EC: result.EC,
        DT: [],
      });
    } else if (result.EC === 0) {
      return res.status(409).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } else {
      return res.status(500).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Something went wrong while creating the user.",
      EC: -1,
      DT: "",
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    console.log(">>> check id", req.params.id);
    let data = await UserService.delete(req.params.id);
    if (data && data.EC === 0) {
      return res.status(404).json({
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
    console.log(error);
    return res.status(500).json({
      EM: "Error message from server", // error message
      EC: "-1", // Error code
      DT: "", // data
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      id,
      ...req.body,
    };

    let response = await UserService.update(data);

    if (response && response.EC === 0) {
      return res.status(404).json({
        EM: response.EM,
        EC: response.EC,
        DT: response.DT,
      });
    } else if (response && +response.EC === -1) {
      return res.status(500).json({
        EM: response.EM,
        EC: response.EC,
        DT: response.DT,
      });
    }

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error message from server",
      EC: -1,
      DT: "",
    });
  }
};
const getUserAccount = (req, res) => {
  return res.status(200).json({
    EM: "ok",
    EC: 1,
    DT: {
      accessToken: req.token,
      username: req.user.username,
      email: req.user.email,
      roleWithPermission: req.user.roles,
    },
  });
};
module.exports = {
  getListUser,
  createUser,
  deleteUser,
  updateUser,
  getUserAccount,
};
