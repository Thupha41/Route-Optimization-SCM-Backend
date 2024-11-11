"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Supplier", "description", {
      type: Sequelize.STRING(1000),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Supplier", "description", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
