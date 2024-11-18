import express from "express";
import SupplierController from "../../controller/supplierController";

const router = express.Router();

router.get("/read", SupplierController.getListSuppliers);
router.post("/create", SupplierController.createSupplier);
router.put("/update/:id", SupplierController.updateSupplier);
router.delete("/delete/:id", SupplierController.deleteSupplier);

export default router;
