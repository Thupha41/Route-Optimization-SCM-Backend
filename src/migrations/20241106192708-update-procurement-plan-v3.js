"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TABLE ProcurementPlans DROP PRIMARY KEY"
    );

    await queryInterface.sequelize.query(
      "ALTER TABLE ProcurementPlans MODIFY id VARCHAR(36) NOT NULL"
    );

    await queryInterface.sequelize.query(
      "ALTER TABLE ProcurementPlans ADD PRIMARY KEY (id)"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TABLE ProcurementPlans MODIFY id INT NOT NULL AUTO_INCREMENT PRIMARY KEY"
    );
  },
};
