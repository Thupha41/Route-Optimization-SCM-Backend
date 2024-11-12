"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn("ProcurementPlans", "destination", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn("ProcurementPlans", "destination", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
};
