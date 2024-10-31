'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Vehicle', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vehicleName: {
        type: Sequelize.STRING
      },
      registeredNum: {
        type: Sequelize.STRING
      },
      capacity: {
        type: Sequelize.INTEGER
      },
      kilometerDriven: {
        type: Sequelize.DOUBLE
      },
      parkingId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Vehicle');
  }
};