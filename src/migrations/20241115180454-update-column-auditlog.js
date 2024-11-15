'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("AuditLog", "user_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("AuditLog", "user_id")
    ])
  }
};
