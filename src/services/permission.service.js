import db from "../models/index";
const {
  ErrorResponse,
  NotFoundResponse,
  BadRequestResponse,
} = require("../core/error.response");
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
        throw new NotFoundResponse({ EM: "Permission not found", DT: [] });
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
        throw new BadRequestResponse({
          EM: `The permission URLs already exist: ${duplicateUrls.join(", ")}`,
          DT: duplicateUrls,
        });
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
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something wrong with create permission service!",
      });
    }
  };

  static update = async (data) => {
    try {
      const { id, url, description } = data;

      // Check if the permission exists
      const permission = await db.Permission.findByPk(id);
      if (!permission) {
        throw new NotFoundResponse({ EM: "Permission not found", DT: [] });
      }

      const existingPermission = await db.Permission.findOne({
        where: {
          url: url,
          id: { [db.Sequelize.Op.ne]: id },
        },
      });

      if (existingPermission) {
        throw new BadRequestResponse({
          EM: "Permission URL already exists",
          DT: null,
        });
      }

      // Update the permission
      await db.Permission.update(
        { url, description },
        {
          where: { id: id },
        }
      );

      // Fetch the updated permission
      const updatedPermission = await db.Permission.findByPk(id);

      return {
        EM: "Permission updated successfully",
        EC: 1,
        DT: updatedPermission,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
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
        throw new NotFoundResponse({ EM: "Permission not found", DT: [] });
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
      if (error instanceof NotFoundResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something wrong with delete permission service!",
      });
    }
  };

  static getPermissionsByRole = async (roleId) => {
    try {
      let roles = await db.Role.findOne({
        where: {
          id: roleId,
        },
        attributes: ["id", "name", "description"],
        include: [
          {
            model: db.Permission,
            attributes: ["id", "url", "description"],
            through: {
              attributes: [],
            },
          },
        ],
        nest: true,
      });

      if (!roles) {
        throw new NotFoundResponse({ EM: "Role not found", DT: [] });
      }

      return {
        EM: "Get permissions by role successfully",
        EC: 1,
        DT: roles,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something wrong with get permissions by role service!",
      });
    }
  };

  static assignPermissionToRole = async (data) => {
    try {
      if (!data.roleId || !Array.isArray(data.rolePermissions)) {
        throw new BadRequestResponse({
          EM: "Invalid input data for assigning permissions to role",
        });
      }

      const role = await db.Role.findByPk(data.roleId);
      if (!role) {
        throw new NotFoundResponse({ EM: "Role not found", DT: [] });
      }

      const transaction = await db.sequelize.transaction();

      try {
        await db.Permission_Role.destroy({
          where: { roleId: data.roleId },
          transaction,
        });

        const validPermissions = await db.Permission.findAll({
          where: { id: data.rolePermissions.map((rp) => rp.permissionId) },
          attributes: ["id"],
          raw: true,
        });

        const validPermissionIds = new Set(validPermissions.map((p) => p.id));
        const rolePermissions = data.rolePermissions
          .filter((rp) => validPermissionIds.has(rp.permissionId))
          .map((rp) => ({ ...rp, roleId: data.roleId }));

        if (rolePermissions.length !== data.rolePermissions.length) {
          throw new BadRequestResponse({
            EM: "Some permission IDs are invalid",
          });
        }
        await db.Permission_Role.bulkCreate(rolePermissions, { transaction });

        await transaction.commit();

        return {
          EM: "Permissions assigned to role successfully",
          EC: 1,
          DT: [],
        };
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something went wrong with assign permission to role service!",
      });
    }
  };
}

module.exports = PermissionService;
