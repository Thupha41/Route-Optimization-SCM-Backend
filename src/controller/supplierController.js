import SupplierService from "../services/supplier.service";
import { OK, CREATED } from "../core/success.response";
import { ErrorResponse } from "../core/error.response";

const getListSuppliers = async (req, res) => {
  try {
    let suppliers = await SupplierService.getSuppliers();
    return new OK({
      EC: suppliers.EC,
      EM: suppliers.EM,
      DT: suppliers.DT,
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

const createSupplier = async (req, res) => {
  try {
    const result = await SupplierService.create(req.body);
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
const deleteSupplier = async (req, res) => {
  try {
    let data = await SupplierService.delete(req.params.id);
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
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      id,
      ...req.body,
    };

    let response = await SupplierService.update(data);

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
  getListSuppliers,
  createSupplier,
  deleteSupplier,
  updateSupplier,
};
