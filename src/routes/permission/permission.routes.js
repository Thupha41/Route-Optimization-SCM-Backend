import express from "express";
import PermissionController from "../../controller/permissionController";

const router = express.Router();

router.get("/read", PermissionController.getListPermissions);
router.post("/create", PermissionController.createPermission);
router.post("/assign-to-role", PermissionController.assignPermissionToRole);
router.put("/update/:id", PermissionController.updatePermission);
router.delete("/delete/:id", PermissionController.deletePermission);

export default router;
