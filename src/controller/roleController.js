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

const createRole = async (req, res) => {
  try {
    const result = await RoleService.create(req.body);
    return new CREATED({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    console.error("Unexpected error:", error);
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};
const deleteRole = async (req, res) => {
  try {
    console.log(">>> check id", req.params.id);
    let data = await RoleService.delete(req.params.id);
    return new OK({
      EC: data.EC,
      EM: data.EM,
      DT: data.DT,
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
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      id,
      ...req.body,
    };

    let response = await RoleService.update(data);

    return new OK({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};

module.exports = {
  getListRoles,
  createRole,
  deleteRole,
  updateRole,
};
