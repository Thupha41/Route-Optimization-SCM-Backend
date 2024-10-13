import express from "express";
import {
  testApi,
  handleRegister,
  handleLogin,
  handleLogout,
} from "../controller/authController";
import UserController from "../controller/userController";
import RoleController from "../controller/roleController";
import PermissionController from "../controller/permissionController";
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";
const router = express.Router();
// function checkUser(req, res, next) {
//   const nonSecurePaths = ['/register', '/login'];
//   if (nonSecurePaths.includes(req.path)) return next();

//   //authenticate user
//   next();
// }

const initApiRoute = (app) => {
  router.all("*", checkUserJWT, checkUserPermission);
  router.get("/test-api", testApi);

  //auth route
  router.get("/account", UserController.getUserAccount);
  router.post("/register", handleRegister);
  router.post("/login", handleLogin);
  router.post("/logout", handleLogout);

  //user route
  router.get("/users/read", UserController.getListUser);
  router.post("/users/create", UserController.createUser);
  router.put("/users/update/:id", UserController.updateUser);
  router.delete("/users/delete/:id", UserController.deleteUser);

  //roles route
  router.get("/roles/read", RoleController.getListRoles);
  router.post("/roles/create", RoleController.createRoles);
  router.put("/roles/update/:id", RoleController.updateRoles);
  router.delete("/roles/delete/:id", RoleController.deleteRoles);

  //permission route
  router.get("/permissions/read", PermissionController.getListPermissions);
  router.post("/permissions/create", PermissionController.createPermission);
  router.put("/permissions/update/:id", PermissionController.updatePermission);
  router.delete(
    "/permissions/delete/:id",
    PermissionController.deletePermission
  );
  return app.use("/api/v1", router);
};

export default initApiRoute;
