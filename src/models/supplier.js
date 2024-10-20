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
      company_code: DataTypes.INTEGER,
      company_name: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      representative_name: DataTypes.STRING,
      address: DataTypes.STRING,
      hasDeliveryTeam: DataTypes.BOOLEAN,
      capacity: DataTypes.DOUBLE,
      description: DataTypes.STRING,
      email: DataTypes.STRING,
      market: DataTypes.STRING,
      scale: DataTypes.STRING,
      product_service: DataTypes.STRING,
      sector: DataTypes.STRING,
      year: DataTypes.STRING,
      tax_code: DataTypes.STRING,
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
