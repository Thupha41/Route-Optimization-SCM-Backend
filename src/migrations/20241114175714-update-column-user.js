"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if uuid_id column exists
    const tableDescription = await queryInterface.describeTable("User");
    if (!tableDescription.uuid_id) {
      await queryInterface.addColumn("User", "uuid_id", {
        type: Sequelize.STRING(36),
        allowNull: true,
      });
    }

    // 1. First modify the id column to remove auto_increment
    await queryInterface.sequelize.query(
      "ALTER TABLE User MODIFY id INT NOT NULL"
    );

    // 3. Generate UUIDs for existing records
    const users = await queryInterface.sequelize.query("SELECT id FROM User", {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    // 4. Update each record with a new UUID
    for (const user of users) {
      await queryInterface.sequelize.query(
        "UPDATE User SET uuid_id = ? WHERE id = ?",
        {
          replacements: [uuidv4(), user.id],
        }
      );
    }

    // 5. Drop the primary key constraint
    await queryInterface.sequelize.query("ALTER TABLE User DROP PRIMARY KEY");

    // 6. Remove the old id column
    await queryInterface.removeColumn("User", "id");

    // 7. Rename uuid_id to id
    await queryInterface.renameColumn("User", "uuid_id", "id");

    // 8. Make id the primary key
    await queryInterface.sequelize.query(
      "ALTER TABLE User MODIFY id VARCHAR(36) NOT NULL PRIMARY KEY"
    );
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Add temporary numeric id column
    await queryInterface.addColumn("User", "numeric_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // 2. Generate sequential IDs
    await queryInterface.sequelize.query(
      "SET @counter = 0; UPDATE User SET numeric_id = @counter := @counter + 1"
    );

    // 3. Drop the primary key
    await queryInterface.sequelize.query("ALTER TABLE User DROP PRIMARY KEY");

    // 4. Remove the UUID id column
    await queryInterface.removeColumn("User", "id");

    // 5. Rename numeric_id to id
    await queryInterface.renameColumn("User", "numeric_id", "id");

    // 6. Set up auto-incrementing primary key
    await queryInterface.sequelize.query(
      "ALTER TABLE User MODIFY id INT NOT NULL AUTO_INCREMENT PRIMARY KEY"
    );
  },
};
