import db from "../models/index";
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
          EC: 0,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      return {
        EM: "Error from get role service",
        EC: -1,
        DT: "",
      };
    }
  };

  static getUserWithPagination = async (page, limit) => {
    try {
      let offset = (page - 1) * limit;
      const { count, rows } = await db.User.findAndCountAll({
        offset: offset,
        limit: limit,
        attributes: ["id", "username", "email", "phone", "sex"],
        include: {
          model: db.Role,
          attributes: ["name", "description"],
        },
        raw: true,
        nest: true,
      });
      let totalPages = Math.ceil(count / limit);
      let data = {
        totalRows: count,
        totalPages: totalPages,
        users: rows,
      };

      if (data.users && data.users.length > 0) {
        return {
          EM: `Get list users at page ${page}, limit ${limit}`,
          EC: 1,
          DT: data,
        };
      } else {
        return {
          EM: `Get list users at page ${page}, limit ${limit}`,
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      return {
        EM: "Error from get user service",
        EC: -1,
        DT: [],
      };
    }
  };
  static create = async (data) => {
    try {
      let user = await db.User.create({});
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
