import db from "../models/index";
const { NotFoundResponse, ErrorResponse } = require("../core/error.response");
import { Op } from "sequelize";
import { getInfoData, removeNull, formatKeys } from "../utils";
import moment from "moment";
import { generateUUID } from "../helpers";
import { io } from "../server";
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
      await db.ProcurementPlan.create({
        ...data,
        id: generateUUID(),
      });

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
        await db.ProcurementPlan.update(data, {
          where: { id: data.id },
        });

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
        [Op.gte]: moment(filters.initialFrom, "YYYY/MM/DD")
          .startOf("day")
          .toDate(),
        [Op.lte]: moment(filters.initialTo, "YYYY/MM/DD").endOf("day").toDate(),
      };
    }

    // Handling deadline custom range from and to
    if (filters.deadlineFrom && filters.deadlineTo) {
      deadlineFilter = {
        [Op.gte]: moment(filters.deadlineFrom, "YYYY/MM/DD")
          .startOf("day")
          .toDate(),
        [Op.lte]: moment(filters.deadlineTo, "YYYY/MM/DD")
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

  static filter_by_query_options = async ({
    filters,
    limit,
    page,
    sort = null,
  }) => {
    try {
      limit = Number(limit) > 0 ? Number(limit) : 10;
      page = Number(page) > 0 ? Number(page) : 1;
      const offset = (page - 1) * limit;
      const new_filters = this.__formatFiltersOptions(filters);

      let orderClauses = [];

      if (sort && Array.isArray(sort) && sort.length === 2) {
        const [field, direction] = sort;
        const sortDirection =
          direction?.toUpperCase() === "ASC" ? "ASC" : "DESC";

        if (field === "priority") {
          orderClauses = [["priority", sortDirection]];
        }
      }

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
        ...(orderClauses.length > 0 ? { order: orderClauses } : {}),
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

  static bulkDelete = async (ids) => {
    try {
      const result = await db.sequelize.transaction(async (t) => {
        const deletedCount = await db.ProcurementPlan.destroy({
          where: {
            id: {
              [Op.in]: ids,
            },
          },
          transaction: t,
        });

        if (deletedCount === 0) {
          throw new NotFoundResponse({
            EM: "No procurement plans found to delete",
          });
        }

        return deletedCount;
      });

      return {
        EM: `Successfully deleted ${result} procurement plan(s)`,
        EC: 1,
        DT: {
          deletedCount: result,
        },
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Error deleting procurement plans",
      });
    }
  };

  static bulkUpdate = async (plans) => {
    try {
      const result = await db.sequelize.transaction(async (t) => {
        const updatePromises = plans.map(async (plan) => {
          const { id, ...updateData } = plan;

          const existingPlan = await db.ProcurementPlan.findOne({
            where: { id },
            include: [
              {
                association: "planner",
                attributes: ["username"],
                required: false,
              },
            ],
            raw: true,
            nest: true,
          });

          if (!existingPlan) {
            throw new NotFoundResponse({
              EM: `Procurement plan with ID ${id} not found`,
            });
          }

          // Notify manager about high priority plans
          if (updateData.priority === 1 && updateData.status === "pending") {
            io.to("manager").emit("highPriorityPlan", {
              message: "New high priority plan requires attention!",
              plan: {
                id: existingPlan.id,
                destination: existingPlan.destination,
                deadline: existingPlan.deadline,
                demand: existingPlan.demand,
                planner: existingPlan.planner?.username || "Unknown",
                priority: updateData.priority,
              },
            });
          }

          // Notify planner about plan status changes
          if (
            updateData.status === "approved" ||
            updateData.status === "rejected"
          ) {
            io.to("planner").emit("planStatusChanged", {
              message: `Your plan has been ${updateData.status}`,
              plan: {
                id: existingPlan.id,
                status: updateData.status,
                destination: existingPlan.destination,
                priority: existingPlan.priority,
              },
            });
          }

          return db.ProcurementPlan.update(updateData, {
            where: { id },
            transaction: t,
          });
        });

        const results = await Promise.all(updatePromises);
        return results.length;
      });

      return {
        EM: `Successfully updated ${result} procurement plan(s)`,
        EC: 1,
        DT: { updatedCount: result },
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Error updating procurement plans",
      });
    }
  };
}

module.exports = ProcurementPlanService;
