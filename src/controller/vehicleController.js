import VehicleService from "../services/vehicle.service";
import { OK, CREATED } from "../core/success.response";
import { ErrorResponse } from "../core/error.response";

const getListVehicle = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let vehicles = await VehicleService.getVehicleWithPagination(
        +page,
        +limit
      );
      return new OK({
        EM: vehicles.EM,
        EC: vehicles.EC,
        DT: vehicles.DT,
      }).send(res);
    } else {
      let vehicles = await VehicleService.getVehicles();
      return new OK({
        EM: vehicles.EM,
        EC: vehicles.EC,
        DT: vehicles.DT,
      }).send(res);
    }
  } catch (error) {
    console.log(error);
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};
const createVehicle = async (req, res) => {
  try {
    const result = await VehicleService.create(req.body);
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
const deleteVehicle = async (req, res) => {
  try {
    let data = await VehicleService.delete(req.params.id);
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
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      id,
      ...req.body,
    };

    let response = await VehicleService.update(data);

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
  getListVehicle,
  createVehicle,
  deleteVehicle,
  updateVehicle,
};
