"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 0;`);

      // 1. Check existing column names
      const [columns] = await queryInterface.sequelize.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'ProcurementPlans'
        AND COLUMN_NAME IN ('plannerId', 'managerId')
      `);

      // 2. Add new UUID columns
      await queryInterface.addColumn("ProcurementPlans", "planner_id_uuid", {
        type: Sequelize.UUID,
        allowNull: true,
      });

      await queryInterface.addColumn("ProcurementPlans", "manager_id_uuid", {
        type: Sequelize.UUID,
        allowNull: true,
      });

      // 3. Copy data if old columns exist
      if (columns.length > 0) {
        await queryInterface.sequelize.query(`
          UPDATE ProcurementPlans pp
          LEFT JOIN User u1 ON pp.plannerId = u1.id
          SET pp.planner_id_uuid = u1.id
        `);

        await queryInterface.sequelize.query(`
          UPDATE ProcurementPlans pp
          LEFT JOIN User u2 ON pp.managerId = u2.id
          SET pp.manager_id_uuid = u2.id
        `);

        // 4. Drop old columns
        await queryInterface.removeColumn("ProcurementPlans", "plannerId");
        await queryInterface.removeColumn("ProcurementPlans", "managerId");
      }

      // 5. Rename new columns
      await queryInterface.renameColumn(
        "ProcurementPlans",
        "planner_id_uuid",
        "plannerId"
      );
      await queryInterface.renameColumn(
        "ProcurementPlans",
        "manager_id_uuid",
        "managerId"
      );

      await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    } catch (error) {
      await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 1;`);
      console.error("Migration Error:", error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 0;`);

      // Remove foreign keys
      await queryInterface.sequelize.query(`
        ALTER TABLE ProcurementPlans
        DROP FOREIGN KEY IF EXISTS fk_planner,
        DROP FOREIGN KEY IF EXISTS fk_manager
      `);

      // Add temporary columns
      await queryInterface.addColumn("ProcurementPlans", "planner_id_int", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
      await queryInterface.addColumn("ProcurementPlans", "manager_id_int", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });

      // Drop UUID columns
      await queryInterface.removeColumn("ProcurementPlans", "plannerId");
      await queryInterface.removeColumn("ProcurementPlans", "managerId");

      // Rename columns back
      await queryInterface.renameColumn(
        "ProcurementPlans",
        "planner_id_int",
        "plannerId"
      );
      await queryInterface.renameColumn(
        "ProcurementPlans",
        "manager_id_int",
        "managerId"
      );

      await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    } catch (error) {
      await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 1;`);
      console.error("Migration Error:", error);
      throw error;
    }
  },
};
