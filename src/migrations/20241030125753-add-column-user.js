"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("User", "fullname", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("User", "fullname")]);
  },
};
