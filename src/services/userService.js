import { where } from "sequelize/lib/sequelize";
import { sequelize } from "../configs/config.mysql";
import db from "../models/index";
import bcrypt from "bcryptjs";

// Configurable salt rounds
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

// Hashes the password asynchronously
const hashPassword = async (userPassword) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(userPassword, salt);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

// Creates a new user in the database
const createNewUser = async (email, password, username) => {
  try {
    const hashPass = await hashPassword(password);
    const user = await db.User.create({
      email: email,
      password: hashPass,
      username: username,
    });
    return user;
  } catch (error) {
    console.error("Error creating new user:", error);
  }
};

//get list of user
const getListUser = async () => {
  let userById = await db.User.findOne({
    // include: [
    //   {
    //     model: db.Role,
    //     // through: {
    //     //   attributes: ["name", "description"],
    //     // },
    //     attributes: ["name", "description"],
    //   },
    // ],
    include: {
      model: db.Role,
      attributes: ["name", "description"],
    },
    attributes: ["id", "username", "email"],
    where: { id: 1 },
    raw: true,
    nest: true,
  });
  let roles1 = await db.Role.findAll({
    where: {
      id: 1,
    },
    include: [
      {
        model: db.Permission,
      },
    ],
    raw: true,
    nest: true,
  });
  let roles = await db.Permission.findAll({
    include: { model: db.Role, where: { id: 1 } },
    raw: true,
    nest: true,
  });

  try {
    // const [results, fields] = await sequelize.query("SELECT * FROM User");
    // console.log(">>> CHECK get list user", results);
    // return results;
    let users = [];
    users = await db.User.findAll({
      raw: true,
    });
    console.log("Check User", users);
    return users;
  } catch (error) {
    console.error("Error getting list of user:", error);
  }
};

//delete user
const deleteUser = async (userId) => {
  try {
    // const [results, fields] = await sequelize.query(
    //   "DELETE FROM User where id = ?",
    //   [id]
    // );
    // console.log(">>> CHECK delete user", results);
    await db.User.destroy({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

//update user
const getUserById = async (userId) => {
  try {
    // const [results, fields] = await sequelize.query(
    //   "SELECT * FROM User WHERE id = ?",
    //   [id]
    // );
    // return results;
    let userById = {};
    userById = await db.User.findOne({
      where: {
        id: userId,
      },
    });
    console.log(">> CHECK USER FIND ONE", userById, ">>>> CHECK ID", userId);
    return userById;
  } catch (error) {
    console.error("Error getting user by id", error);
  }
};
const editUser = async (email, username, id) => {
  try {
    // const [results, fields] = await sequelize.query(
    //   "UPDATE User SET email = ?, username = ? WHERE id = ?",
    //   [email, username, id]
    // );
    // console.log(results);
    await db.User.update(
      {
        email: email,
        username: username,
      },
      {
        where: {
          id: id,
        },
      }
    );
  } catch (error) {
    console.error("Error editing user", error);
  }
};
module.exports = {
  createNewUser,
  getListUser,
  deleteUser,
  getUserById,
  editUser,
};
