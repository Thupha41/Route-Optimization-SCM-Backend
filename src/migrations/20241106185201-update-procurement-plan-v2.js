"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("ProcurementPlans", "id", {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("ProcurementPlans", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
    });
  },
};
