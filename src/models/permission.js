"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Permission.belongsToMany(models.Role, {
        through: "Permission_Role",
        foreignKey: "permissionId",
      });
    }
  }
  Permission.init(
    {
      url: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize: sequelize,
      modelName: "Permission",
      freezeTableName: true,
      tableName: "Permission",
    }
  );
  return Permission;
};
