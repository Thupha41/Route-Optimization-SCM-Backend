"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ResetPasswordToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with the ResetPasswordToken model
      ResetPasswordToken.belongsTo(models.User, { foreignKey: "userID" });
    }
  }

  ResetPasswordToken.init(
    {
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      verifyToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      consumed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ResetPasswordToken",
      freezeTableName: true,
      tableName: "ResetPasswordToken",
    }
  );

  return ResetPasswordToken;
};
