"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // 1. Get all users with their roles using a JOIN
      const users = await queryInterface.sequelize.query(
        `SELECT User.id, Role.name as roleName 
         FROM User 
         JOIN Role ON User.roleId = Role.id`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      // Find default planner and manager UUIDs by role name
      const defaultPlanner = users.find((u) => u.roleName === "planner");
      const defaultManager = users.find((u) => u.roleName === "manager");

      if (!defaultPlanner || !defaultManager) {
        throw new Error("Default planner or manager not found");
      }

      // 2. Modify columns to VARCHAR(36)
      await queryInterface.sequelize.query(
        "ALTER TABLE ProcurementPlans MODIFY plannerId VARCHAR(36)"
      );
      await queryInterface.sequelize.query(
        "ALTER TABLE ProcurementPlans MODIFY managerId VARCHAR(36)"
      );

      // 3. Update all records with the correct UUIDs
      await queryInterface.sequelize.query(
        `UPDATE ProcurementPlans 
         SET plannerId = ?,
             managerId = ?`,
        {
          replacements: [defaultPlanner.id, defaultManager.id],
        }
      );

      // Log for verification
      console.log("Updated with UUIDs:", {
        plannerUUID: defaultPlanner.id,
        managerUUID: defaultManager.id,
      });
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // 1. Add temporary columns
      await queryInterface.addColumn("ProcurementPlans", "planner_id_temp", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });

      await queryInterface.addColumn("ProcurementPlans", "manager_id_temp", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });

      // 2. Set default values
      await queryInterface.sequelize.query(
        `UPDATE ProcurementPlans SET 
         planner_id_temp = 2,
         manager_id_temp = 3`
      );

      // 3. Change main columns back to INTEGER
      await queryInterface.sequelize.query(
        "ALTER TABLE ProcurementPlans MODIFY plannerId INT"
      );
      await queryInterface.sequelize.query(
        "ALTER TABLE ProcurementPlans MODIFY managerId INT"
      );

      // 4. Update with temp values
      await queryInterface.sequelize.query(
        `UPDATE ProcurementPlans SET 
         plannerId = planner_id_temp,
         managerId = manager_id_temp`
      );

      // 5. Remove temp columns
      await queryInterface.removeColumn("ProcurementPlans", "planner_id_temp");
      await queryInterface.removeColumn("ProcurementPlans", "manager_id_temp");
    } catch (error) {
      console.error("Down migration failed:", error);
      throw error;
    }
  },
};
