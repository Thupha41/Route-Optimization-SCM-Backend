import RoleService from "../services/role.service";
import { OK, CREATED, NO_CONTENT } from "../core/success.response";
import { ErrorResponse } from "../core/error.response";
const getListRoles = async (req, res) => {
  try {
    let roles = await RoleService.getRoles();
    return new OK({
      EC: roles.EC,
      EM: roles.EM,
      DT: roles.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    return new ErrorResponse({
      EM: "Error message from server",
    }).send(res);
  }
};

const createRoles = async () => {
  try {
  } catch (error) {
    console.log(error);
  }
};
const deleteRoles = async (req, res) => {
  try {
    console.log(">>> check id", req.params.id);
    let data = await UserService.delete(req.params.id);
    return new OK({
      EC: roles.EC,
      EM: roles.EM,
      DT: roles.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    return new ErrorResponse({
      EM: "Error message from server",
    }).send(res);
  }
};
const updateRoles = async () => {
  try {
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getListRoles,
  createRoles,
  deleteRoles,
  updateRoles,
};
