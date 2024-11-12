"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, { foreignKey: "roleId" });
      User.hasMany(models.ResetPasswordToken, { foreignKey: "userID" });
      User.hasMany(models.ProcurementPlan, {
        foreignKey: "plannerId",
        as: "planner_of_plan",
      });
      User.hasMany(models.ProcurementPlan, {
        foreignKey: "managerId",
        as: "manager_of_plan",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      username: DataTypes.STRING,
      address: DataTypes.STRING,
      sex: DataTypes.STRING,
      phone: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
      refreshToken: DataTypes.STRING,
      typeLogin: {
        type: DataTypes.STRING,
        defaultValue: "local",
      },
    },
    {
      sequelize: sequelize,
      modelName: "User",
      freezeTableName: true,
      tableName: "User",
    }
  );
  return User;
};
