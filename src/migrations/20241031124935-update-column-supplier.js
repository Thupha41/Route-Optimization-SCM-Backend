"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Supplier", "company_code"),
      queryInterface.renameColumn("Supplier", "company_name", "CompanyName"),
      queryInterface.renameColumn("Supplier", "address", "Address"),
      queryInterface.renameColumn("Supplier", "phone_number", "phone"),
      queryInterface.renameColumn(
        "Supplier",
        "representative_name",
        "representative"
      ),
      queryInterface.renameColumn(
        "Supplier",
        "product_service",
        "ProductAndService"
      ),
      queryInterface.renameColumn("Supplier", "market", "Market"),
      queryInterface.renameColumn("Supplier", "tax_code", "Masothue"),
      queryInterface.renameColumn("Supplier", "year", "Year"),
      queryInterface.renameColumn("Supplier", "scale", "Scale"),
      queryInterface.renameColumn("Supplier", "capacity", "Capacity"),
      queryInterface.addColumn("Supplier", "Price", {
        type: Sequelize.DOUBLE,
        allowNull: true,
      }),
      queryInterface.addColumn("Supplier", "formatted_address", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Supplier", "latitude", {
        type: Sequelize.DOUBLE,
        allowNull: true,
      }),
      queryInterface.addColumn("Supplier", "longitude", {
        type: Sequelize.DOUBLE,
        allowNull: true,
      }),
      queryInterface.addColumn("Supplier", "place_id", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.removeColumn("Supplier", "hasDeliveryTeam"),
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Supplier", "company_code", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.renameColumn("Supplier", "CompanyName", "company_name"),
      queryInterface.renameColumn("Supplier", "Address", "address"),
      queryInterface.renameColumn("Supplier", "phone", "phone_number"),
      queryInterface.renameColumn(
        "Supplier",
        "representative",
        "representative_name"
      ),
      queryInterface.renameColumn(
        "Supplier",
        "ProductAndService",
        "product_service"
      ),
      queryInterface.renameColumn("Supplier", "Market", "market"),
      queryInterface.renameColumn("Supplier", "Masothue", "tax_code"),
      queryInterface.renameColumn("Supplier", "Year", "year"),
      queryInterface.renameColumn("Supplier", "Scale", "scale"),
      queryInterface.renameColumn("Supplier", "Capacity", "capacity"),
      queryInterface.removeColumn("Supplier", "Price"),
      queryInterface.removeColumn("Supplier", "formatted_address"),
      queryInterface.removeColumn("Supplier", "latitude"),
      queryInterface.removeColumn("Supplier", "longitude"),
      queryInterface.removeColumn("Supplier", "place_id"),
      queryInterface.addColumn("Supplier", "hasDeliveryTeam", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
    ]);
  },
};
