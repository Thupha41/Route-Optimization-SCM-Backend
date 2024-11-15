'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn("Vehicle", "id", {
        type: Sequelize.UUID,
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn("Vehicle", "id", {
        type: Sequelize.INTEGER,
      })
    ]);
  }
};
