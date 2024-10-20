import db from "../models/index";
const { NotFoundResponse, ErrorResponse } = require("../core/error.response");

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
      await db.Role.create(data);

      return {
        EM: "Role created successfully.",
        EC: 1,
        DT: [],
      };

    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something's wrong with creating a role!",
      });
    }
  };
  static update = async (data) => {
    try {
      let role = await db.Role.findOne({
        where: {
          id: data.id,
        },
      });

      if (role) {
        await db.Role.update(
          {
            data
          },
          {
            where: { id: data.id },
          }
        );

        return {
          EM: "Update role successfully",
          EC: 1,
          DT: [],
        };
      } else {
        throw new NotFoundResponse({
          EM: "Role not found",
        });
      }
    } catch (error) {
      console.log(error);
      return {
        EM: "Something's wrong with updating this role!",
        EC: -1,
        DT: "",
      };
    }
  };
  static delete = async (id) => {
    try {
      await db.Role.destroy({
        where: {
          id: id,
        },
      });
      
      return {
        EM: "Role deleted successfully",
        EC: 1,
        DT: [],
      };
    
    } catch (error) {
      console.log(error);
      return {
        EM: "Error from delete role service",
        EC: -1,
        DT: "",
      };
    }
  };
}

module.exports = RoleService;
