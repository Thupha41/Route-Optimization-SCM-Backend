"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Parking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Parking.hasMany(models.Vehicle, {
        foreignKey: "parking_id",
        as: "vehicles",
      });
    }
  }
  Parking.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      formatted_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      place_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: sequelize,
      modelName: "Parking",
      freezeTableName: true,
      tableName: "Parking",
    }
  );
  return Parking;
};
