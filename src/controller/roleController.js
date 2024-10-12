import RoleService from "../services/role.service";

const ReadFunc = async (req, res) => {
  try {
    let roles = await RoleService.getRoles();
    if (roles && +roles.EC === 1) {
      res.status(200).json({
        EM: roles.EM, // error or success message
        EC: roles.EC, // Error code
        DT: roles.DT, // data
      });
    } else if (roles && roles.EC === 0) {
      // Not found response
      return res.status(404).json({
        EM: roles.EM, // "No roles found"
        EC: roles.EC, // Error code
        DT: roles.DT, // empty array
      });
    } else {
      return res.status(500).json({
        EM: roles.EM, // error or success message
        EC: roles.EC, // Error code
        DT: roles.DT, // data
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

const createUser = async () => {
  try {
  } catch (error) {
    console.log(error);
  }
};
const deleteUser = async (req, res) => {
  try {
    console.log(">>> check id", req.params.id);
    let data = await UserService.delete(req.params.id);
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
const updateUser = async () => {
  try {
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  ReadFunc,
  createUser,
  deleteUser,
  updateUser,
};
