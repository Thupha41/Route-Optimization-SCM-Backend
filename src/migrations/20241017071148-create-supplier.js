"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Supplier", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      company_code: {
        type: Sequelize.INTEGER,
      },
      company_name: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      representative_name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      hasDeliveryTeam: {
        type: Sequelize.BOOLEAN,
      },
      capacity: {
        type: Sequelize.DOUBLE,
      },
      market: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      scale: {
        type: Sequelize.STRING,
      },
      product_service: {
        type: Sequelize.STRING,
      },
      sector: {
        type: Sequelize.STRING,
      },
      year: {
        type: Sequelize.STRING
      },
      tax_code: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Supplier");
  },
};
