import db from "../models/index";
const { ErrorResponse } = require("../core/error.response");
class PermissionService {
  static getPermissions = async () => {
    try {
      let permissions = await db.Permission.findAll({
        attributes: ["id", "url", "description"],
        order: [["url", "DESC"]],
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
        EM: "Something wrong with get permissions service!",
      });
    }
  };

  static getPermissionsWithPagination = async (page = 1, limit = 5) => {
    try {
      page = Math.max(1, parseInt(page, 10));
      limit = Math.max(1, parseInt(limit, 10));
      let offset = (page - 1) * limit;
      const { count, rows } = await db.Permission.findAndCountAll({
        offset: offset,
        limit: limit,
        attributes: ["id", "url", "description"],
        order: [["url", "DESC"]],
        raw: true,
      });
      let totalPages = Math.ceil(count / limit);
      let data = {
        totalRows: count,
        totalPages: totalPages,
        permissions: rows,
      };

      return {
        EM: `Get list permissions at page ${page}, limit ${limit}`,
        EC: 1,
        DT: data.permissions.length > 0 ? data : [],
      };
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something wrong with get permissions service!",
      });
    }
  };

  static create = async (permissionData) => {
    try {
      // Ensure permissionData is always an array
      const permissions = Array.isArray(permissionData)
        ? permissionData
        : [permissionData];

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
          EM: `Created ${newPermissions.length} permission(s) successfully`,
          EC: 1,
          DT: newPermissions,
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
        EM: "Something wrong with create permission service!",
      });
    }
  };

  static update = async (data) => {
    try {
      const { id, url, description } = data;

      const existingPermission = await db.Permission.findOne({
        where: {
          url: url,
          id: { [db.Sequelize.Op.ne]: id },
        },
      });

      if (existingPermission) {
        return {
          EM: "Permission URL already exists",
          EC: 0,
          DT: null,
        };
      }

      // Update the permission
      const [updatedRowsCount] = await db.Permission.update(
        { url, description },
        {
          where: { id: id },
        }
      );

      if (updatedRowsCount === 0) {
        return {
          EM: "Permission not found",
          EC: 0,
          DT: null,
        };
      }

      // Fetch the updated permission
      const updatedPermission = await db.Permission.findByPk(id);

      return {
        EM: "Permission updated successfully",
        EC: 1,
        DT: updatedPermission,
      };
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something wrong with update permission service!",
      });
    }
  };
  static delete = async (id) => {
    try {
      // Step 1: Find the permission by ID
      const permission = await db.Permission.findOne({
        where: { id: id },
      });

      if (!permission) {
        return {
          EM: "Permission not found",
          EC: 0,
          DT: null,
        };
      }

      // Step 2: Delete the permission
      let result = await db.Permission.destroy({
        where: { id: id },
      });

      if (result === 1) {
        return {
          EM: `Permission '${permission.url}' deleted successfully`,
          EC: 1,
          DT: [],
        };
      } else {
        return {
          EM: "Failed to delete the permission",
          EC: -1,
          DT: null,
        };
      }
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something wrong with delete permission service!",
      });
    }
  };
}

module.exports = PermissionService;
