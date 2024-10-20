import express from "express";
// import {
//   testApi,
//   handleRegister,
//   handleLogin,
//   handleLogout,
// } from "../controller/authController";
import AuthController from "../controller/authController";
import UserController from "../controller/userController";
import RoleController from "../controller/roleController";
import SupplierController from "../controller/supplierController";
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
  router.get("/test-api", AuthController.testApi);

  //auth route
  router.get("/account", UserController.getUserAccount);
  router.post("/register", AuthController.handleRegister);
  router.post("/login", AuthController.handleLogin);
  router.post("/logout", AuthController.handleLogout);
  // router.get("/login", checkUser.isLogin, loginController.getLoginPage);
  // router.post("/auth/handleForgetPassword", AuthController.handleForgetPassword);

  //user route
  router.get("/users/read", UserController.getListUser);
  router.post("/users/create", UserController.createUser);
  router.put("/users/update/:id", UserController.updateUser);
  router.delete("/users/delete/:id", UserController.deleteUser);

  //roles route
  router.get("/roles/read", RoleController.getListRoles);
  router.post("/roles/create", RoleController.createRole);
  router.put("/roles/update/:id", RoleController.updateRole);
  router.delete("/roles/delete/:id", RoleController.deleteRole);

  //Supplier route
  router.get("/suppliers/read", SupplierController.getListSuppliers);
  router.post("/suppliers/create", SupplierController.createSupplier);
  router.put("/suppliers/update/:id", SupplierController.updateSupplier);
  router.delete("/suppliers/delete/:id", SupplierController.deleteSupplier);

  //permission route
  router.get("/permissions/read", PermissionController.getListPermissions);
  router.post("/permissions/create", PermissionController.createPermission);
  router.post(
    "/permissions/assign-to-role",
    PermissionController.assignPermissionToRole
  );
  router.put("/permissions/update/:id", PermissionController.updatePermission);
  router.delete(
    "/permissions/delete/:id",
    PermissionController.deletePermission
  );
  return app.use("/api/v1", router);
};

export default initApiRoute;
