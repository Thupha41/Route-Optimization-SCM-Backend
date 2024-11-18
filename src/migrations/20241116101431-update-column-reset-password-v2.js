"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("ResetPasswordToken", "id", {
      type: Sequelize.UUID,
    });
    await queryInterface.changeColumn("ResetPasswordToken", "userID", {
      type: Sequelize.UUID,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("ResetPasswordToken", "id", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.changeColumn("ResetPasswordToken", "userID", {
      type: Sequelize.INTEGER,
    });
  },
};
