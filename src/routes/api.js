import express from "express";
import permissionRoutes from "./permission/permission.routes";
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";
import auditLogRoutes from "./auditlog/auditlog.routes";
import parkingRoutes from "./parking/parking.routes";
import authRoutes from "./auth/auth.routes";
import roleRoutes from "./role/role.routes";
import procurementPlanRoutes from "./procurement-plan/procurementplan.routes";
import vehicleRoutes from "./vehicle/vehicle.routes";
import supplierRoutes from "./supplier/supplier.routes";
import userRoutes from "./user/user.routes";
const router = express.Router();

const initApiRoute = (app) => {
  router.all("*", checkUserJWT, checkUserPermission);

  //service route
  // router.post("/verify-services-jwt", checkServicesJWT);

  //auditlog route
  router.use("/audit-log", auditLogRoutes);
  //auth route
  router.use("/auth", authRoutes);

  //user route
  router.use("/users", userRoutes);
  //procurement plan route
  router.use("/procurement-plan", procurementPlanRoutes);

  //roles route
  router.use("/roles", roleRoutes);

  //Supplier route
  router.use("/suppliers", supplierRoutes);

  //permission route
  router.use("/permissions", permissionRoutes);

  //parking route
  router.use("/parkings", parkingRoutes);

  //vehicle route
  router.use("/vehicle", vehicleRoutes);

  return app.use("/api/v1", router);
};

export default initApiRoute;
