"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProcurementPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      ProcurementPlan.belongsTo(models.User, {
        foreignKey: "plannerId",
        as: "planner",
      });
      ProcurementPlan.belongsTo(models.User, {
        foreignKey: "managerId",
        as: "manager",
      });
    }
  }
  ProcurementPlan.init(
    {
      id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      plannerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      managerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      material: DataTypes.STRING,
      deadline: DataTypes.DATE,
      initialDate: DataTypes.DATE,
      status: DataTypes.STRING,
      priority: DataTypes.INTEGER,
      demand: DataTypes.DOUBLE,
      destination: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProcurementPlan",
    }
  );
  return ProcurementPlan;
};
