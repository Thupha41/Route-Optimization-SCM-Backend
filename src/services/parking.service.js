import db from "../models/index";
const { NotFoundResponse, ErrorResponse } = require("../core/error.response");

class ParkingService {
  static getParkings = async () => {
    try {
      let parking = await db.Parking.findAll({
        attributes: ["id", "name", "address"],
        order: [["id", "DESC"]],
        raw: true,
      });

      if (parking && parking.length > 0) {
        return {
          EM: "get list parkings",
          EC: 1,
          DT: parking,
        };
      } else {
        return {
          EM: "No parkings found",
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something wrong with parking service!",
      });
    }
  };

  static getParkingWithPagination = async (page, limit) => {
    try {
      let offset = (page - 1) * limit;
      const { count, rows } = await db.Parking.findAndCountAll({
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
        parkingList: rows,
      };

      if (data.parkingList && data.parkingList.length > 0) {
        return {
          EM: `Get list parking at page ${page}, limit ${limit}`,
          EC: 1,
          DT: data,
        };
      } else {
        return {
          EM: `Get list parking at page ${page}, limit ${limit}`,
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      console.log(error);
      throw new ErrorResponse({
        EM: "Something wrong with get parking list service!",
      });
    }
  };

  static create = async (data) => {
    try {
      await db.Parking.create(data);

      return {
        EM: "New parking area created successfully.",
        EC: 1,
        DT: [],
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something's wrong with creating a parking!",
      });
    }
  };
  static update = async (data) => {
    try {
      const { id, name, address } = data;
      let findParkingById = await db.Parking.findOne({
        where: {
          id: data.id,
        },
      });

      if (findParkingById) {
        await db.Parking.update(
          {
            name,
            address,
          },
          {
            where: { id: data.id },
          }
        );

        return {
          EM: "Update parking successfully",
          EC: 1,
          DT: [],
        };
      } else {
        throw new NotFoundResponse({
          EM: "Parking not found",
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something wrong with update parking service!",
      });
    }
  };
  static delete = async (id) => {
    try {
      const parkingById = await db.Parking.findOne({
        where: { id: id },
      });

      if (!parkingById) {
        throw new NotFoundResponse({ EM: "Parking not found", DT: [] });
      }

      let result = await db.Parking.destroy({
        where: { id: id },
      });

      if (result === 1) {
        return {
          EM: `Parking '${parkingById.name}' deleted successfully`,
          EC: 1,
          DT: [],
        };
      } else {
        return {
          EM: "Failed to delete the parking",
          EC: -1,
          DT: null,
        };
      }
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundResponse) {
        throw error;
      }
      throw new ErrorResponse({
        EM: "Something wrong with delete permission service!",
      });
    }
  };
}

module.exports = ParkingService;
