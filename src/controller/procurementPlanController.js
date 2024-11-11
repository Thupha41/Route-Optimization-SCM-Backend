import ProcurementPlanService from "../services/procurementPlan.service";
import { OK, CREATED } from "../core/success.response";
import { ErrorResponse } from "../core/error.response";

const getListProcurementPlan = async (req, res) => {
  try {
    let procurementPlans = await ProcurementPlanService.getProcurementPlan();
    return new OK({
      EC: procurementPlans.EC,
      EM: procurementPlans.EM,
      DT: procurementPlans.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    return new ErrorResponse({
      EM: "Error message from server",
    }).send(res);
  }
};

const createProcurementPlan = async (req, res) => {
  try {
    const result = await ProcurementPlanService.create(req.body);
    return new CREATED({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    console.error("Unexpected error:", error);
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};
const deleteProcurementPlan = async (req, res) => {
  try {
    let data = await ProcurementPlanService.delete(req.params.id);
    return new OK({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    console.error("Unexpected error:", error);
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};
const updateProcurementPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      id,
      ...req.body,
    };

    let response = await ProcurementPlanService.update(data);

    return new OK({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};

const searchProcurementPlan = async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery || "";
    const result = await ProcurementPlanService.search(searchQuery);
    return new OK({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};

const filterPlans = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const result = await ProcurementPlanService.filter_by_query_options({
      ...req.body,
      limit: +limit,
      page: +page,
    });

    new OK({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};

const bulkDeleteProcurementPlans = async (req, res) => {
  try {
    const { ids } = req.body;

    const result = await ProcurementPlanService.bulkDelete(ids);

    return new OK({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};

const bulkUpdateProcurementPlans = async (req, res) => {
  try {
    const { plans } = req.body;

    // Validate input
    if (!Array.isArray(plans) || plans.length === 0) {
      return new ErrorResponse({
        EM: "Please provide an array of procurement plans to update",
      }).send(res);
    }

    // Validate that each plan has an id
    if (!plans.every((plan) => plan.id)) {
      return new ErrorResponse({
        EM: "Each plan must have an id",
      }).send(res);
    }

    const result = await ProcurementPlanService.bulkUpdate(plans);

    return new OK({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
    }).send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return error.send(res);
    }
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};

module.exports = {
  getListProcurementPlan,
  createProcurementPlan,
  deleteProcurementPlan,
  updateProcurementPlan,
  searchProcurementPlan,
  filterPlans,
  bulkDeleteProcurementPlans,
  bulkUpdateProcurementPlans,
};
