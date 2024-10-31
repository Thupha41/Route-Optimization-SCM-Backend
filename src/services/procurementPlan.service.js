import db from "../models/index";
const { NotFoundResponse, ErrorResponse } = require("../core/error.response");

class ProcurementPlanService {
  static getProcurementPlan = async () => {
    try {
      let procurementPlans = await db.ProcurementPlan.findAll({
        // attributes: [`id`, `company_code`, `company_name`, `phone_number`, `representative_name`, `address`, `hasDeliveryTeam`],
        include: [
          {
            association: "planner",
            attributes: [],
            required: false,
          },
          {
            association: "manager",
            attributes: [],
            required: false,
          }
        ],
        // order: [["name", "ASC"]],
        raw: true,
        nest: true,
      });

      if (procurementPlans && procurementPlans.length > 0) {
        return {
          EM: "get list procurement plans",
          EC: 1,
          DT: procurementPlans,
        };
      } else {
        return {
          EM: "No procurement plans found",
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something wrong with procurement plan service!",
      });
    }
  };

  static create = async (data) => {
    try {
      await db.ProcurementPlan.create(data);

      return {
        EM: "Procurement plan created successfully.",
        EC: 1,
        DT: [],
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something's wrong with creating a procurement plan!",
      });
    }
  };
  static update = async (data) => {
    try {
      let procurementPlan = await db.ProcurementPlan.findOne({
        where: {
          id: data.id,
        },
      });

      if (procurementPlan) {
        await db.ProcurementPlan.update(data,
          {
            where: { id: data.id },
          }
        );

        return {
          EM: "Update procurement plan successfully",
          EC: 1,
          DT: [],
        };
      } else {
        throw new NotFoundResponse({
          EM: "Procurement plan not found",
        });
      }

    } catch (error) {
      console.log(error);
      return {
        EM: "Something's wrong with updating this procurement plan!",
        EC: -1,
        DT: "",
      };
    }
  };
  static delete = async (id) => {
    try {
      let result = await db.ProcurementPlan.destroy({
        where: {
          id: id,
        },
      });
      
      if (result === 1) {
        return {
          EM: "Procurement plan deleted successfully",
          EC: 1,
          DT: [],
        };
      } else {
        return {
          EM: "Procurement plan not found",
          EC: 0,
          DT: "",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        EM: "Error from delete procurement plan service",
        EC: -1,
        DT: "",
      };
    }
  };
}

module.exports = ProcurementPlanService;
