import db from "../models/index";
const {
  ConflictRequestError,
  UnauthorizedResponse,
  ForbiddenRequestError,
  BadRequestError,
  ErrorResponse,
} = require("../core/error.response");
class PermissionService {
  static getPermissions = async () => {
    try {
      let permissions = await db.Permission.findAll({
        attributes: ["id", "url", "description"],
        order: [["url", "ASC"]],
        raw: true,
      });

      if (permissions && permissions.length > 0) {
        return {
          EM: "get list permissions",
          EC: 1,
          DT: permissions,
        };
      } else {
        return {
          EM: "No permissions found",
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something wrong with permission service!",
      });
    }
  };

  static create = async (permissions) => {
    try {
      // Step 1: Get current permissions from the database
      let currentPermissions = await this.getPermissions();
      if (!currentPermissions || currentPermissions.EC !== 1) {
        throw new ErrorResponse({
          EM: "Failed to retrieve current permissions",
        });
      }

      // Step 2: Extract URLs from the current permissions
      const currentUrls = currentPermissions.DT.map(({ url }) => url);

      // Step 3: Separate new permissions from existing ones
      const duplicateUrls = [];
      const newPermissions = [];

      for (let permission of permissions) {
        if (currentUrls.includes(permission.url)) {
          duplicateUrls.push(permission.url);
        } else {
          newPermissions.push(permission);
        }
      }

      // Step 4: If there are duplicate URLs, return an error message with those URLs
      if (duplicateUrls.length > 0) {
        return {
          EM: `The permission URLs already exist: ${duplicateUrls.join(", ")}`,
          EC: 0,
          DT: duplicateUrls,
        };
      }

      // Step 5: Bulk create new permissions if no duplicates
      if (newPermissions.length > 0) {
        await db.Permission.bulkCreate(newPermissions);
        return {
          EM: `Create ${newPermissions.length} permissions successfully`,
          EC: 1,
          DT: [],
        };
      }

      // If no permissions to create
      return {
        EM: `No new permissions were added.`,
        EC: 1,
        DT: [],
      };
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something wrong with permission service!",
      });
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

module.exports = PermissionService;
