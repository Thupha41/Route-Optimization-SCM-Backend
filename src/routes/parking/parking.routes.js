import express from "express";
import ParkingController from "../../controller/parkingController";

const router = express.Router();

router.get("/read", ParkingController.getListParking);
router.post("/create", ParkingController.createParking);
router.put("/update/:id", ParkingController.updateParking);
router.delete("/delete/:id", ParkingController.deleteParking);

export default router;
