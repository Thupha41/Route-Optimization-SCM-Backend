"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("AuditLog", "id", {
      type: Sequelize.UUID,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("AuditLog", "id", {
      type: Sequelize.INTEGER,
    });
  },
};
