'use strict';
const {
  Model
} = require('sequelize');
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
        foreignKey: "plannerID",
        as: "planner"
      })
      ProcurementPlan.belongsTo(models.User, { 
        foreignKey: "managerID",
        as: "manager"
      })
    }
  };
  ProcurementPlan.init({
    plannerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    managerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    material: DataTypes.STRING,
    deadline: DataTypes.DATE,
    initialDate: DataTypes.DATE,
    status: DataTypes.STRING,
    priority: DataTypes.INTEGER,
    demand: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'ProcurementPlan',
  });
  return ProcurementPlan;
};