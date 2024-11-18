import db from "../models/index";
const { NotFoundResponse, ErrorResponse } = require("../core/error.response");

class AuditLogService {
  static getAuditLogs = async () => {
    try {
      let auditLog = await db.AuditLog.findAll({
        // attributes: ["id", "name", "address"],
        include: [
          {
            association: "user",
            attributes: ["username"],
          },
        ],
        order: [["id", "DESC"]],
        raw: true,
        nest: true,
      });

      if (auditLog && auditLog.length > 0) {
        return {
          EM: "get list auditLogs",
          EC: 1,
          DT: auditLog,
        };
      } else {
        return {
          EM: "No auditLogs found",
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something's wrong with auditLog service!",
      });
    }
  };

  static getAuditLogWithPagination = async (page, limit) => {
    try {
      let offset = (page - 1) * limit;
      const { count, rows } = await db.AuditLog.findAndCountAll({
        offset: offset,
        limit: limit,
        attributes: ["id", "name", "address"],
        order: [["id", "DESC"]],
        raw: true,
      });
      let totalPages = Math.ceil(count / limit);
      let data = {
        totalRows: count,
        totalPages: totalPages,
        auditLogList: rows,
      };

      if (data.auditLogList && data.auditLogList.length > 0) {
        return {
          EM: `Get list auditLog at page ${page}, limit ${limit}`,
          EC: 1,
          DT: data,
        };
      } else {
        return {
          EM: `Get list auditLog at page ${page}, limit ${limit}`,
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something's wrong with get auditLog list service!",
      });
    }
  };

  static create = async (data) => {
    try {
      await db.AuditLog.create(data);

      return {
        EM: "New auditLog created successfully.",
        EC: 1,
        DT: [],
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something's wrong with creating a auditLog!",
      });
    }
  };
  static update = async (data) => {
    try {
      let auditLog = await db.AuditLog.findOne({
        where: {
          id: data.id,
        },
      });

      if (auditLog) {
        await db.AuditLog.update(data, {
          where: { id: data.id },
        });

        return {
          EM: "Update auditLog successfully",
          EC: 1,
          DT: [],
        };
      } else {
        throw new NotFoundResponse({
          EM: "AuditLog not found",
        });
      }
    } catch (error) {
      console.log(error);
      return {
        EM: "Something's wrong with updating this auditLog!",
        EC: -1,
        DT: "",
      };
    }
  };
  static delete = async (id) => {
    try {
      let result = await db.AuditLog.destroy({
        where: {
          id: id,
        },
      });

      if (result === 1) {
        return {
          EM: "AuditLog deleted successfully",
          EC: 1,
          DT: [],
        };
      } else {
        return {
          EM: "AuditLog not found",
          EC: 0,
          DT: "",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        EM: "Error from delete auditLog service",
        EC: -1,
        DT: "",
      };
    }
  };
}

module.exports = AuditLogService;
