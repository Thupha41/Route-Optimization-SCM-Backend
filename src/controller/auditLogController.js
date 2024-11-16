import AuditLogService from "../services/auditLog.service";
import { OK, CREATED } from "../core/success.response";
import { ErrorResponse } from "../core/error.response";

const getListAuditLog = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let auditLogs = await AuditLogService.getAuditLogWithPagination(
        +page,
        +limit
      );
      return new OK({
        EM: auditLogs.EM,
        EC: auditLogs.EC,
        DT: auditLogs.DT,
      }).send(res);
    } else {
      let auditLogs = await AuditLogService.getAuditLogs();
      return new OK({
        EM: auditLogs.EM,
        EC: auditLogs.EC,
        DT: auditLogs.DT,
      }).send(res);
    }
  } catch (error) {
    console.log(error);
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};
const createAuditLog = async (req, res) => {
  try {
    const result = await AuditLogService.create(req.body);
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
const deleteAuditLog = async (req, res) => {
  try {
    let data = await AuditLogService.delete(req.params.id);
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
const updateAuditLog = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      id,
      ...req.body,
    };

    let response = await AuditLogService.update(data);

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

module.exports = {
  getListAuditLog,
  createAuditLog,
  deleteAuditLog,
  updateAuditLog,
};
