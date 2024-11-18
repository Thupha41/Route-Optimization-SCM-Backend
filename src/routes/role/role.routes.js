import express from "express";
import RoleController from "../../controller/roleController";
import PermissionController from "../../controller/permissionController";
const router = express.Router();

router.get("/read", RoleController.getListRoles);
router.post("/create", RoleController.createRole);
router.put("/update/:id", RoleController.updateRole);
router.delete("/delete/:id", RoleController.deleteRole);
router.get("/:id/permissions", PermissionController.getPermissionByRole);
export default router;
