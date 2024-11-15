import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
// Configurable salt rounds
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const {
  ErrorResponse,
  ConflictRequestError,
  NotFoundResponse,
  BadRequestResponse,
} = require("../core/error.response");

// Hashes the password asynchronously
const hashUserPassword = async (userPassword) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(userPassword, salt);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

class UserService {
  static getAll = async () => {
    try {
      let users = await db.User.findAll({
        attributes: ["id", "username", "email", "phone", "sex"],
        include: {
          model: db.Role,
          attributes: ["name", "description", "id"],
        },
        raw: true,
        nest: true,
      });

      if (users && users.length > 0) {
        return {
          EM: "get list users",
          EC: 1,
          DT: users,
        };
      } else {
        return {
          EM: "get list users",
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something wrong with get user service!",
      });
    }
  };

  static getUserWithPagination = async (page, limit) => {
    try {
      let offset = (page - 1) * limit;
      const { count, rows } = await db.User.findAndCountAll({
        offset: offset,
        limit: limit,
        exclude: ["password", "refreshToken"],
        order: [["id", "DESC"]],
        include: {
          model: db.Role,
          attributes: ["name", "description", "id"],
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
      throw new ErrorResponse({
        EM: "Something wrong with get user service!",
      });
    }
  };
  static create = async (data) => {
    try {
      // Step 1: Check email/phone number already existed
      let userByEmail = await db.User.findOne({
        where: { email: data.email },
        raw: true,
      });

      if (userByEmail) {
        throw new ConflictRequestError({
          EM: "The email is already existed!",
          DT: "email",
        });
      }
      let userByPhone = await db.User.findOne({
        where: { phone: data.phone },
        raw: true,
      });

      if (userByPhone) {
        throw new ConflictRequestError({
          EM: "The phone number is already existed!",
          DT: "phone",
        });
      }

      //Step 2: hash user password
      let hashPassword = await hashUserPassword(data.password);
      //Step 3: create new user
      await db.User.create({ ...data, password: hashPassword });
      return {
        EM: "User created successfully.",
        EC: 1,
        DT: [],
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something wrong with create user service!",
      });
    }
  };
  static update = async (data) => {
    try {
      if (!data.roleId) {
        throw new BadRequestResponse({
          EM: "Role is required",
          DT: "role",
        });
      }

      // Find user by ID
      let user = await db.User.findOne({
        where: { id: data.id },
      });

      if (user) {
        await db.User.update(
          {
            data,
          },
          {
            where: { id: data.id },
          }
        );

        return {
          EM: "Update user successfully",
          EC: 1,
          DT: [],
        };
      } else {
        throw new NotFoundResponse({
          EM: "User not found",
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something wrong with update user service!",
      });
    }
  };
  static delete = async (id) => {
    try {
      let result = await db.User.destroy({
        where: {
          id: id,
        },
      });
      if (result === 1) {
        return {
          EM: "User deleted successfully",
          EC: 1,
          DT: [],
        };
      } else {
        throw new NotFoundResponse({
          EM: "User not found",
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something wrong with delete user service!",
      });
    }
  };

  static search = async (searchQuery) => {
    try {
      const whereConditions = searchQuery
        ? {
            [Op.or]: [
              { id: { [Op.like]: `%${searchQuery}%` } },
              { email: { [Op.like]: `%${searchQuery}%` } },
              { username: { [Op.like]: `%${searchQuery}%` } },
              { address: { [Op.like]: `%${searchQuery}%` } },
              { phone: { [Op.like]: `%${searchQuery}%` } },
              { sex: { [Op.like]: `%${searchQuery}%` } },
              { fullname: { [Op.like]: `%${searchQuery}%` } },
              { "$Role.name$": { [Op.like]: `%${searchQuery}%` } },
            ],
          }
        : {};

      let users = await db.User.findAll({
        where: whereConditions,
        attributes: {
          exclude: ["password", "roleId"],
        },
        include: [
          {
            model: db.Role,
            attributes: ["name", "description", "id"],
            required: false,
          },
        ],
        raw: true,
        nest: true,
      });

      if (users && users.length > 0) {
        users = users.map((user) => {
          const { Role, ...rest } = user;
          return {
            ...rest,
            role: Role
              ? {
                  id: Role.id,
                  name: Role.name,
                  description: Role.description,
                }
              : null,
          };
        });

        return {
          EM: "get list query users",
          EC: 1,
          DT: users,
        };
      } else {
        throw new NotFoundResponse({
          EM: "No query users found",
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something's wrong with searching users!",
      });
    }
  };

  static bulkDelete = async (ids) => {
    try {
      const result = await db.sequelize.transaction(async (t) => {
        const deletedCount = await db.User.destroy({
          where: {
            id: {
              [Op.in]: ids,
            },
          },
          transaction: t,
        });

        if (deletedCount === 0) {
          throw new NotFoundResponse({
            EM: "No users found to delete",
          });
        }

        return deletedCount;
      });

      return {
        EM: `Successfully deleted ${result} user(s)`,
        EC: 1,
        DT: {
          deletedCount: result,
        },
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Error deleting users",
      });
    }
  };

  static bulkUpdate = async (users) => {
    try {
      const result = await db.sequelize.transaction(async (t) => {
        const updatePromises = users.map(async (user) => {
          const { id, ...updateData } = user;

          const existingUser = await db.User.findOne({
            where: { id },
            include: [
              {
                model: db.Role,
                attributes: ["name", "description", "id"],
                required: false,
              },
            ],
            raw: true,
            nest: true,
          });

          if (!existingUser) {
            throw new NotFoundResponse({
              EM: `User with ID ${id} not found`,
            });
          }
          return db.User.update(updateData, {
            where: { id },
            transaction: t,
          });
        });

        const results = await Promise.all(updatePromises);
        return results.length;
      });

      return {
        EM: `Successfully updated ${result} user(s)`,
        EC: 1,
        DT: { updatedCount: result },
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Error updating users",
      });
    }
  };
}

module.exports = UserService;
