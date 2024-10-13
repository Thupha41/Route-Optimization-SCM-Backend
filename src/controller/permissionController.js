import PermissionService from "../services/permission.service";
import { OK, CREATED, NO_CONTENT } from "../core/success.response";
import { ErrorResponse, BadRequestResponse } from "../core/error.response";
const getListPermissions = async (req, res) => {
  try {
    let permissions = await PermissionService.getPermissions();
    return new OK({
      EC: permissions.EC,
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
const createPermission = async (req, res) => {
  try {
    // Step 1: Call the Permission Service to create new permissions
    const permissions = await PermissionService.create(req.body);

    // Step 2: If the service returns an error code, handle it
    if (permissions && permissions.EC !== 1) {
      // Wrap the error message in a BadRequestResponse to standardize the response structure
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
const updatePermission = async (req, res) => {
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

module.exports = {
  getListPermissions,
  createPermission,
  deletePermission,
  updatePermission,
};
