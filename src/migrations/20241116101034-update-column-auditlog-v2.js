"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // 1. Verify User table structure
      await queryInterface.sequelize.query(`
        SELECT DATA_TYPE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'User' 
        AND COLUMN_NAME = 'id'
      `);

      // 2. Create temporary UUID column
      await queryInterface.addColumn("AuditLog", "user_id_uuid", {
        type: Sequelize.UUID,
        allowNull: true,
      });

      // 3. Remove existing foreign key if exists
      try {
        const [constraints] = await queryInterface.sequelize.query(`
          SELECT CONSTRAINT_NAME 
          FROM information_schema.KEY_COLUMN_USAGE 
          WHERE TABLE_NAME = 'AuditLog' 
          AND COLUMN_NAME = 'user_id'
        `);

        for (const constraint of constraints) {
          await queryInterface.sequelize.query(`
            ALTER TABLE AuditLog 
            DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME}
          `);
        }
      } catch (error) {
        console.log("No existing foreign key found");
      }

      // 4. Drop old column and rename new one
      await queryInterface.removeColumn("AuditLog", "user_id");
      await queryInterface.renameColumn("AuditLog", "user_id_uuid", "user_id");

      // 5. Ensure column is properly typed
      await queryInterface.changeColumn("AuditLog", "user_id", {
        type: Sequelize.UUID,
        allowNull: true,
      });

      // 6. Add the foreign key using Sequelize's method
      await queryInterface.addConstraint("AuditLog", {
        fields: ["user_id"],
        type: "foreign key",
        name: "fk_auditlog_user_id",
        references: {
          table: "User",
          field: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    } catch (error) {
      console.error("Migration Error:", error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint("AuditLog", "fk_auditlog_user_id");
      await queryInterface.addColumn("AuditLog", "user_id_int", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
      await queryInterface.removeColumn("AuditLog", "user_id");
      await queryInterface.renameColumn("AuditLog", "user_id_int", "user_id");
    } catch (error) {
      console.error("Migration Error:", error);
      throw error;
    }
  },
};
