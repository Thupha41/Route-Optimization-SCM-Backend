'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AuditLog.init({
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    params: {
      type: DataTypes.STRING,
      allowNull: true
    },
    query: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payload: {
      type: DataTypes.STRING,
      allowNull: true
    },
    response: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'AuditLog',
    freezeTableName: true,
    tableName: "AuditLog",
  });
  return AuditLog;
};