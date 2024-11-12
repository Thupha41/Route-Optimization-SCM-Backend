"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Supplier.init(
    {
      // company_code: DataTypes.INTEGER,

      CompanyName: DataTypes.STRING,
      Address: DataTypes.STRING,
      phone: DataTypes.STRING,
      representative: DataTypes.STRING,
      email: DataTypes.STRING,
      description: DataTypes.STRING(1000),
      sector: DataTypes.STRING,
      ProductAndService: DataTypes.STRING,
      Market: DataTypes.STRING,
      Masothue: DataTypes.STRING,
      Year: DataTypes.STRING,
      Scale: DataTypes.STRING,
      Capacity: DataTypes.DOUBLE,
      Price: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
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

      // hasDeliveryTeam: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Supplier",
      freezeTableName: true,
      tableName: "Supplier",
    }
  );

  return Supplier;
};
