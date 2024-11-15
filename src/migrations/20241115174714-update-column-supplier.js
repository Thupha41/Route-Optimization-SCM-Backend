"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn("Supplier", "id", {
        type: Sequelize.UUID,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn("Supplier", "id", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },
};
