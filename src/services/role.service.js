import db from "../models/index";
const {
  ConflictRequestError,
  UnauthorizedResponse,
  ForbiddenRequestError,
  BadRequestError,
  ErrorResponse,
} = require("../core/error.response");
class RoleService {
  static getRoles = async () => {
    try {
      let roles = await db.Role.findAll({
        attributes: ["id", "name", "description"],
        // include: {
        //   model: db.Permission,
        //   attributes: ["url", "description"],
        // },
        order: [["name", "ASC"]],
        raw: true,
        nest: true,
      });

      if (roles && roles.length > 0) {
        return {
          EM: "get list roles",
          EC: 1,
          DT: roles,
        };
      } else {
        return {
          EM: "No roles found",
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something wrong with role service!",
      });
    }
  };

  static create = async (data) => {
    try {
      let role = await db.Role.create({});
    } catch (error) {
      console.log(error);
      return {
        EM: "Error from get user service",
        EC: -1,
        DT: "",
      };
    }
  };
  static update = async (data) => {
    try {
      let user = await db.User.update({
        where: {
          id: data.id,
        },
      });

      if (user) {
        user.save();
      } else {
        //not found
        return {};
      }
    } catch (error) {
      console.log(error);
      return {
        EM: "Error from update user service",
        EC: -1,
        DT: "",
      };
    }
  };
  static delete = async (id) => {
    try {
      let result = await db.User.destroy({
        where: {
          id: id,
        },
      });
      console.log(">>> check delete user", result);
      if (result === 1) {
        return {
          EM: "User deleted successfully",
          EC: 1,
          DT: [],
        };
      } else {
        return {
          EM: "User not found",
          EC: 0,
          DT: "",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        EM: "Error from delete user service",
        EC: -1,
        DT: "",
      };
    }
  };
}

module.exports = RoleService;
