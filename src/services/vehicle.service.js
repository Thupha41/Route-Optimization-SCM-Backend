import db from "../models/index";
const { NotFoundResponse, ErrorResponse } = require("../core/error.response");

class VehicleService {
  static getVehicles = async () => {
    try {
      let vehicle = await db.Vehicle.findAll({
        // attributes: ["id", "name", "address"],
        order: [["id", "DESC"]],
        raw: true,
      });

      if (vehicle && vehicle.length > 0) {
        return {
          EM: "get list vehicles",
          EC: 1,
          DT: vehicle,
        };
      } else {
        return {
          EM: "No vehicles found",
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something's wrong with vehicle service!",
      });
    }
  };

  static getVehicleWithPagination = async (page, limit) => {
    try {
      let offset = (page - 1) * limit;
      const { count, rows } = await db.Vehicle.findAndCountAll({
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
        vehicleList: rows,
      };

      if (data.vehicleList && data.vehicleList.length > 0) {
        return {
          EM: `Get list vehicle at page ${page}, limit ${limit}`,
          EC: 1,
          DT: data,
        };
      } else {
        return {
          EM: `Get list vehicle at page ${page}, limit ${limit}`,
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something's wrong with get vehicle list service!",
      });
    }
  };

  static create = async (data) => {
    try {
      await db.Vehicle.create(data);

      return {
        EM: "New vehicle created successfully.",
        EC: 1,
        DT: [],
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something's wrong with creating a vehicle!",
      });
    }
  };
  static update = async (data) => {
    try {
      let vehicle = await db.Vehicle.findOne({
        where: {
          id: data.id,
        },
      });

      if (vehicle) {
        await db.Vehicle.update(data,
          {
            where: { id: data.id },
          }
        );

        return {
          EM: "Update vehicle successfully",
          EC: 1,
          DT: [],
        };
      } else {
        throw new NotFoundResponse({
          EM: "Vehicle not found",
        });
      }

    } catch (error) {
      console.log(error);
      return {
        EM: "Something's wrong with updating this vehicle!",
        EC: -1,
        DT: "",
      };
    }
  };
  static delete = async (id) => {
    try {
      let result = await db.Vehicle.destroy({
        where: {
          id: id,
        },
      });
      
      if (result === 1) {
        return {
          EM: "Vehicle deleted successfully",
          EC: 1,
          DT: [],
        };
      } else {
        return {
          EM: "Vehicle not found",
          EC: 0,
          DT: "",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        EM: "Error from delete vehicle service",
        EC: -1,
        DT: "",
      };
    }
  };
}

module.exports = VehicleService;
