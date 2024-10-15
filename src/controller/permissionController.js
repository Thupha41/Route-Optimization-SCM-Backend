import PermissionService from "../services/permission.service";
import { OK } from "../core/success.response";
import {
  ErrorResponse,
  BadRequestResponse,
  NotFoundResponse,
} from "../core/error.response";
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
    // Step 1: Call the Permission Service to create new permissions
    const permissions = await PermissionService.create(req.body);

    // Step 2: If the service returns an error code, handle it
    if (permissions && permissions.EC !== 1) {
      return new BadRequestResponse({
        EM: permissions.EM,
        DT: permissions.DT,
      }).send(res);
    }

    // Step 3: Return success if everything is okay
    return new OK({
      EC: permissions.EC,
      EM: permissions.EM,
      DT: permissions.DT,
    }).send(res);
  } catch (error) {
    // Step 4: If an expected error is thrown, send it to the client
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }

    // Step 5: Handle unexpected errors
    console.error("Unexpected error:", error);
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};
const deletePermission = async (req, res) => {
  try {
    const result = await PermissionService.delete(req.params.id);

    if (result.EC === 0) {
      return new NotFoundResponse({ EM: result.EM }).send(res);
    }

    return new OK({ EM: result.EM, EC: result.EC, DT: result.DT }).send(res);
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
    console.log(">>> check id", id);
    const data = {
      id,
      ...req.body,
    };

    let result = await PermissionService.update(data);

    if (result && result.EC === 0) {
      return new NotFoundResponse({ EC: result.EC, EM: result.EM }).send(res);
    }

    return new OK({
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

module.exports = {
  getListPermissions,
  createPermission,
  deletePermission,
  updatePermission,
};
