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
      // Parking.hasMany(models.Vehicle, {
      //   foreignKey: "parking_id",
      //   as: "vehicles",
      // });
    }
  }
  Parking.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
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
