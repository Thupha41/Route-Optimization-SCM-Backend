import express from "express";
import AuditLogController from "../../controller/auditLogController";

const router = express.Router();

router.get("/read", AuditLogController.getListAuditLog);
router.post("/create", AuditLogController.createAuditLog);
router.put("/update/:id", AuditLogController.deleteAuditLog);
router.delete("/delete/:id", AuditLogController.updateAuditLog);

export default router;
