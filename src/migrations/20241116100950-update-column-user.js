"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("User", "id", {
      type: Sequelize.UUID,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("User", "id", {
      type: Sequelize.INTEGER,
    });
  },
};
