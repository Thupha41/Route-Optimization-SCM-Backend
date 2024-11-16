import express from "express";
import ProcurementPlanController from "../../controller/procurementPlanController";
import { auditLogMiddleware } from "../../middleware/auditLogging";
const router = express.Router();

router.get("/read", ProcurementPlanController.getListProcurementPlan);
router.get("/search", ProcurementPlanController.searchProcurementPlan);
router.post(
  "/create",
  auditLogMiddleware,
  ProcurementPlanController.createProcurementPlan
);
router.post("/filter", ProcurementPlanController.filterPlans);
router.put(
  "/update/:id",
  auditLogMiddleware,
  ProcurementPlanController.updateProcurementPlan
);
router.delete("/delete/:id", ProcurementPlanController.deleteProcurementPlan);
router.delete(
  "/bulk-delete",
  auditLogMiddleware,
  ProcurementPlanController.bulkDeleteProcurementPlans
);
router.put(
  "/bulk-update",
  auditLogMiddleware,
  ProcurementPlanController.bulkUpdateProcurementPlans
);

export default router;
