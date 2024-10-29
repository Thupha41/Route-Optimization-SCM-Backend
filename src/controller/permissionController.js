import PermissionService from "../services/permission.service";
import { OK } from "../core/success.response";
import { ErrorResponse } from "../core/error.response";
const getListPermissions = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let permissions = await PermissionService.getPermissionsWithPagination(
        +page,
        +limit
      );
      return new OK({
        EC: permissions.EC,
        EM: permissions.EM,
        DT: permissions.DT,
      }).send(res);
    } else {
      let permissions = await PermissionService.getPermissions();
      return new OK({
        EC: permissions.EC,
        EM: permissions.EM,
        DT: permissions.DT,
      }).send(res);
    }
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

const createPermission = async (req, res) => {
  try {
    const permissions = await PermissionService.create(req.body);

    return new OK({
      EC: permissions.EC,
      EM: permissions.EM,
      DT: permissions.DT,
    }).send(res);
  } catch (error) {
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    console.error("Unexpected error:", error);
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};
const deletePermission = async (req, res) => {
  try {
    const result = await PermissionService.delete(req.params.id);

    return new OK({ EC: result.EC, EM: result.EM, DT: result.DT }).send(res);
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
const updatePermission = async (req, res) => {
  try {
    const id = req.params.id;
    const data = {
      id,
      ...req.body,
    };

    let result = await PermissionService.update(data);

    return new OK({
      EC: result.EC,
      EM: result.EM,
      DT: result.DT,
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

const getPermissionByRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const permissions = await PermissionService.getPermissionsByRole(roleId);
    return new OK({
      EM: permissions.EM,
      DT: permissions.DT,
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
const assignPermissionToRole = async (req, res) => {
  try {
    if (
      !req.body.data ||
      !req.body.data.roleId ||
      !Array.isArray(req.body.data.rolePermissions)
    ) {
      return new BadRequestResponse({
        EM: "Invalid request data",
      }).send(res);
    }
    const roleId = req.body.data.roleId;
    req.body.data.rolePermissions = req.body.data.rolePermissions.map((rp) => ({
      ...rp,
      roleId: roleId,
    }));

    const result = await PermissionService.assignPermissionToRole(
      req.body.data
    );
    return new OK({
      EC: result.EC,
      EM: result.EM,
      DT: result.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    return new ErrorResponse({
      EM: "Error assigning permissions to role",
    }).send(res);
  }
};

module.exports = {
  getListPermissions,
  createPermission,
  deletePermission,
  updatePermission,
  getPermissionByRole,
  assignPermissionToRole,
};
