'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vehicle.belongsTo(models.Parking, {
        foreignKey: "parking_id",
        as: "parking",
      })
    }
  };
  Vehicle.init({
    vehicle_name: DataTypes.STRING,
    registered_num: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    kilometer_driven: DataTypes.DOUBLE,
    parking_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Vehicle',
    freezeTableName: true,
    tableName: "Vehicle",
  });
  return Vehicle;
};