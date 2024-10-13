import db from "../models/index";
import bcrypt from "bcryptjs";
// Configurable salt rounds
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

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
      return {
        EM: "Error from get user service",
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
        attributes: ["id", "username", "email", "phone", "sex", "address"],
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
      return {
        EM: "Error from get user service",
        EC: -1,
        DT: [],
      };
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
        return { EM: "The email is already existed!", EC: 0, DT: "email" };
      }
      let userByPhone = await db.User.findOne({
        where: { phone: data.phone },
        raw: true,
      });

      if (userByPhone) {
        return {
          EM: "The phone number is already existed!",
          EC: 0,
          DT: "phone",
        };
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
      return {
        EM: "Something wrong with create user service!",
        EC: -1,
      };
    }
  };
  static update = async (data) => {
    try {
      if (!data.roleId) {
        return {
          EC: 0,
          EM: "Error with empty role",
          DT: "role",
        };
      }

      // Find user by ID
      let user = await db.User.findOne({
        where: { id: data.id },
      });

      if (user) {
        // Update the user record using the where clause to specify which user to update
        await db.User.update(
          {
            username: data.username,
            sex: data.sex,
            address: data.address,
            roleId: data.roleId,
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
        return {
          EM: "Failed to update user - user not found",
          EC: 0,
          DT: [],
        };
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

module.exports = UserService;
