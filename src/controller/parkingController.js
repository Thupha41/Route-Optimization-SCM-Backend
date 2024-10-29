import ParkingService from "../services/parking.service";
import { OK, CREATED } from "../core/success.response";
import { ErrorResponse } from "../core/error.response";

const getListParking = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let parkings = await ParkingService.getParkingWithPagination(
        +page,
        +limit
      );
      return new OK({
        EM: parkings.EM,
        EC: parkings.EC,
        DT: parkings.DT,
      }).send(res);
    } else {
      let parkings = await ParkingService.getParkings();
      return new OK({
        EM: parkings.EM,
        EC: parkings.EC,
        DT: parkings.DT,
      }).send(res);
    }
  } catch (error) {
    console.log(error);
    return new ErrorResponse({
      EM: "Something went wrong with server",
    }).send(res);
  }
};
const createNewParking = async (req, res) => {
  try {
    const result = await ParkingService.create(req.body);
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
const deleteParkingArea = async (req, res) => {
  try {
    let data = await ParkingService.delete(req.params.id);
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
const updateParkingArea = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      id,
      ...req.body,
    };

    let response = await ParkingService.update(data);

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
  getListParking,
  createNewParking,
  deleteParkingArea,
  updateParkingArea,
};
