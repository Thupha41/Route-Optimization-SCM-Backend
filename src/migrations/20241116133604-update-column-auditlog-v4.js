"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("AuditLog", "activity", {
      type: Sequelize.STRING(1000),
    });
    await queryInterface.changeColumn("AuditLog", "query", {
      type: Sequelize.STRING(1000),
    });
    await queryInterface.changeColumn("AuditLog", "payload", {
      type: Sequelize.STRING(1000),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("AuditLog", "activity", {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn("AuditLog", "query", {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn("AuditLog", "payload", {
      type: Sequelize.STRING,
    });
  },
};
