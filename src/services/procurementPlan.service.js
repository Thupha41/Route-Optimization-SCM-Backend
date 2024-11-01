import db from "../models/index";
const { NotFoundResponse, ErrorResponse } = require("../core/error.response");
import { Op } from "sequelize";
import { getInfoData, removeNull, formatKeys } from "../utils";
import moment from "moment";
class ProcurementPlanService {
  static getProcurementPlan = async () => {
    try {
      let procurementPlans = await db.ProcurementPlan.findAll({
        include: [
          {
            association: "planner",
            attributes: ["username"],
            required: false,
          },
          {
            association: "manager",
            attributes: [],
            required: false,
          },
        ],
        raw: true,
        nest: true,
      });

      if (procurementPlans && procurementPlans.length > 0) {
        procurementPlans = procurementPlans.map((plan) => {
          const { plannerId, ...rest } = plan;
          return {
            ...rest,
            planner: plan.planner
              ? {
                  plannerId,
                  username: plan.planner.username,
                }
              : null,
          };
        });

        return {
          EM: "get list procurement plans",
          EC: 1,
          DT: procurementPlans,
        };
      } else {
        throw new NotFoundResponse({
          EM: "No procurement plans found",
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something wrong with reading procurement plan service!",
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
        throw new NotFoundResponse({
          EM: "Procurement plan not found",
        });
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
  static search = async (searchQuery) => {
    try {
      const whereConditions = searchQuery
        ? {
            [Op.or]: [
              { id: { [Op.like]: `%${searchQuery}%` } },
              { destination: { [Op.like]: `%${searchQuery}%` } },
            ],
          }
        : {};

      let procurementPlans = await db.ProcurementPlan.findAll({
        where: whereConditions,
        include: [
          {
            association: "planner",
            attributes: ["username"],
            required: false,
          },
          {
            association: "manager",
            attributes: [],
            required: false,
          },
        ],
        raw: true,
        nest: true,
      });

      if (procurementPlans && procurementPlans.length > 0) {
        procurementPlans = procurementPlans.map((plan) => {
          const { plannerId, ...rest } = plan;
          return {
            ...rest,
            planner: plan.planner
              ? {
                  plannerId,
                  username: plan.planner.username,
                }
              : null,
          };
        });

        return {
          EM: "get list query procurement plans",
          EC: 1,
          DT: procurementPlans,
        };
      } else {
        throw new NotFoundResponse({
          EM: "No query procurement plans found",
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something's wrong with searching a procurement plan!",
      });
    }
  };

  static __formatFiltersOptions = (filters) => {
    // Extracting only the actual database column filters
    const formattedFilters = formatKeys(
      getInfoData(["status", "priority"], filters)
    );

    let initialDateFilter = null;
    let deadlineFilter = null;

    // Handling initialDate custom range from and to
    if (filters.initialFrom && filters.initialTo) {
      initialDateFilter = {
        [Op.gte]: moment(filters.initialFrom, "DD/MM/YYYY")
          .startOf("day")
          .toDate(),
        [Op.lte]: moment(filters.initialTo, "DD/MM/YYYY").endOf("day").toDate(),
      };
    }

    // Handling deadline custom range from and to
    if (filters.deadlineFrom && filters.deadlineTo) {
      deadlineFilter = {
        [Op.gte]: moment(filters.deadlineFrom, "DD/MM/YYYY")
          .startOf("day")
          .toDate(),
        [Op.lte]: moment(filters.deadlineTo, "DD/MM/YYYY")
          .endOf("day")
          .toDate(),
      };
    }

    // do all filters and remove null values
    return removeNull({
      ...formattedFilters,
      ...(initialDateFilter ? { initialDate: initialDateFilter } : {}),
      ...(deadlineFilter ? { deadline: deadlineFilter } : {}),
    });
  };

  static filter_by_query_options = async ({ filters, limit, page }) => {
    try {
      limit = Number(limit) > 0 ? Number(limit) : 10;
      page = Number(page) > 0 ? Number(page) : 1;

      const offset = (page - 1) * limit;

      const new_filters = this.__formatFiltersOptions(filters);

      const { count, rows } = await db.ProcurementPlan.findAndCountAll({
        where: {
          ...new_filters,
        },
        include: [
          {
            association: "planner",
            attributes: ["username"],
            required: false,
          },
          {
            association: "manager",
            attributes: [],
            required: false,
          },
        ],
        limit: limit,
        offset: offset,
        raw: true,
        nest: true,
      });

      let totalPages = Math.ceil(count / limit);

      let data = {
        totalRows: count,
        totalPages: totalPages,
        procurementPlans: rows,
      };

      if (data.procurementPlans && data.procurementPlans.length > 0) {
        return {
          EM: `Get list procurement plans at page ${page}, limit ${limit}`,
          EC: 1,
          DT: data,
        };
      } else {
        throw new NotFoundResponse({
          EM: `No procurement plans found`,
        });
      }
    } catch (error) {
      console.error(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something's wrong with filtering a procurement plan!",
      });
    }
  };
}

module.exports = ProcurementPlanService;
