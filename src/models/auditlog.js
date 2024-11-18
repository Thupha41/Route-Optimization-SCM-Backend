"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AuditLog.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  AuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: "User",
          key: "id",
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      activity: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      params: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      query: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      payload: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      response: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "AuditLog",
      freezeTableName: true,
      tableName: "AuditLog",
    }
  );
  return AuditLog;
};
