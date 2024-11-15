import UserService from "../services/user.service";
import { OK, CREATED } from "../core/success.response";
import { ErrorResponse } from "../core/error.response";

const getListUser = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let users = await UserService.getUserWithPagination(+page, +limit);
      return new OK({
        EM: users.EM,
        EC: users.EC,
        DT: users.DT,
      }).send(res);
    } else {
      let users = await UserService.getAll();
      return new OK({
        EM: users.EM,
        EC: users.EC,
        DT: users.DT,
      }).send(res);
    }
  } catch (error) {
    console.log(error);
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};
const createUser = async (req, res) => {
  try {
    const result = await UserService.create(req.body);
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

const searchUser = async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery || "";
    const result = await UserService.search(searchQuery);
    return new OK({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
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

const deleteUser = async (req, res) => {
  try {
    let data = await UserService.delete(req.params.id);
    return new OK({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
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
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      id,
      ...req.body,
    };

    let response = await UserService.update(data);

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
const getUserAccount = (req, res) => {
  return new OK({
    EM: "get user detail successfully",
    DT: {
      user_id: req.user.user_id,
      access_token: req.user.access_token,
      refresh_token: req.user.refresh_token,
      username: req.user.username,
      email: req.user.email,
      roleWithPermission: req.user.roleWithPermission,
    },
  }).send(res);
};

const bulkDeleteUsers = async (req, res) => {
  try {
    const { ids } = req.body;

    const result = await UserService.bulkDelete(ids);

    return new OK({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
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

const bulkUpdateUsers = async (req, res) => {
  try {
    const { users } = req.body;

    // Validate input
    if (!Array.isArray(users) || users.length === 0) {
      return new ErrorResponse({
        EM: "Please provide an array of users to update",
      }).send(res);
    }

    if (!users.every((user) => user.id)) {
      return new ErrorResponse({
        EM: "Each user must have an id",
      }).send(res);
    }

    const result = await UserService.bulkUpdate(users);

    return new OK({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
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
  getListUser,
  createUser,
  deleteUser,
  updateUser,
  getUserAccount,
  searchUser,
  bulkDeleteUsers,
  bulkUpdateUsers,
};
