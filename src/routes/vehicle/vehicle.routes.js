import express from "express";
import VehicleController from "../../controller/vehicleController";

const router = express.Router();

router.get("/read", VehicleController.getListVehicle);
router.post("/create", VehicleController.createVehicle);
router.put("/update/:id", VehicleController.updateVehicle);
router.delete("/delete/:id", VehicleController.deleteVehicle);

export default router;
