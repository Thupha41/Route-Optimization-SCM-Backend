"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("ProcurementPlans", "uuid_id", {
      type: Sequelize.STRING(36),
      allowNull: true,
    });

    // 2. Generate UUIDs for existing records
    const records = await queryInterface.sequelize.query(
      "SELECT id FROM ProcurementPlans",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (const record of records) {
      await queryInterface.sequelize.query(
        "UPDATE ProcurementPlans SET uuid_id = ? WHERE id = ?",
        {
          replacements: [uuidv4(), record.id],
        }
      );
    }

    await queryInterface.sequelize.query(
      "ALTER TABLE ProcurementPlans DROP PRIMARY KEY"
    );

    await queryInterface.removeColumn("ProcurementPlans", "id");

    await queryInterface.renameColumn("ProcurementPlans", "uuid_id", "id");

    // 6. Make id the primary key
    await queryInterface.sequelize.query(
      "ALTER TABLE ProcurementPlans MODIFY id VARCHAR(36) NOT NULL PRIMARY KEY"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("ProcurementPlans", "numeric_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.sequelize.query(
      "SET @counter = 0; UPDATE ProcurementPlans SET numeric_id = @counter := @counter + 1"
    );

    await queryInterface.sequelize.query(
      "ALTER TABLE ProcurementPlans DROP PRIMARY KEY"
    );

    await queryInterface.removeColumn("ProcurementPlans", "id");

    await queryInterface.renameColumn("ProcurementPlans", "numeric_id", "id");

    await queryInterface.sequelize.query(
      "ALTER TABLE ProcurementPlans MODIFY id INT NOT NULL AUTO_INCREMENT PRIMARY KEY"
    );
  },
};
