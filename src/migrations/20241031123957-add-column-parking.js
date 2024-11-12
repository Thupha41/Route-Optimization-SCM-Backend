"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Parking", "formatted_address", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Parking", "latitude", {
        type: Sequelize.DOUBLE,
        allowNull: true,
      }),
      queryInterface.addColumn("Parking", "longitude", {
        type: Sequelize.DOUBLE,
        allowNull: true,
      }),
      queryInterface.addColumn("Parking", "place_id", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Parking", "formatted_address"),
      queryInterface.removeColumn("Parking", "latitude"),
      queryInterface.removeColumn("Parking", "longitude"),
      queryInterface.removeColumn("Parking", "place_id"),
    ]);
  },
};
