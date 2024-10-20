import db from "../models/index";
const { NotFoundResponse, ErrorResponse } = require("../core/error.response");

class SupplierService {
  static getSuppliers = async () => {
    try {
      let suppliers = await db.Supplier.findAll({
        // attributes: [`id`, `company_code`, `company_name`, `phone_number`, `representative_name`, `address`, `hasDeliveryTeam`],
        // include: {
        //   model: db.Permission,
        //   attributes: ["url", "description"],
        // },
        // order: [["name", "ASC"]],
        raw: true,
        nest: true,
      });

      if (suppliers && suppliers.length > 0) {
        return {
          EM: "get list suppliers",
          EC: 1,
          DT: suppliers,
        };
      } else {
        return {
          EM: "No suppliers found",
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something wrong with supplier service!",
      });
    }
  };

  static create = async (data) => {
    try {
      await db.Supplier.create(data);

      return {
        EM: "Supplier created successfully.",
        EC: 1,
        DT: [],
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something's wrong with creating a supplier!",
      });
    }
  };
  static update = async (data) => {
    try {
      let supplier = await db.Supplier.findOne({
        where: {
          id: data.id,
        },
      });

      if (supplier) {
        await db.Supplier.update(
          {
            data
          },
          {
            where: { id: data.id },
          }
        );

        return {
          EM: "Update supplier successfully",
          EC: 1,
          DT: [],
        };
      } else {
        throw new NotFoundResponse({
          EM: "Supplier not found",
        });
      }

    } catch (error) {
      console.log(error);
      return {
        EM: "Something's wrong with updating this supplier!",
        EC: -1,
        DT: "",
      };
    }
  };
  static delete = async (id) => {
    try {
      let result = await db.Supplier.destroy({
        where: {
          id: id,
        },
      });
      console.log(">>> check delete supplier", result);
      if (result === 1) {
        return {
          EM: "Supplier deleted successfully",
          EC: 1,
          DT: [],
        };
      } else {
        return {
          EM: "Supplier not found",
          EC: 0,
          DT: "",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        EM: "Error from delete supplier service",
        EC: -1,
        DT: "",
      };
    }
  };
}

module.exports = SupplierService;
