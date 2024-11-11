"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("ResetPasswordToken", "verifyToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("ResetPasswordToken", "verifyToken", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
