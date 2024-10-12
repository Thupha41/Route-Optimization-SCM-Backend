import express from "express";
import {
  testApi,
  handleRegister,
  handleLogin,
} from "../controller/authController";
import UserController from "../controller/userController";
import RoleController from "../controller/roleController";
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
  router.get("/account", UserController.getUserAccount);
  router.post("/register", handleRegister);
  router.post("/login", handleLogin);
  router.get("/users/read", UserController.getListUser);
  router.get("/roles/read", RoleController.ReadFunc);
  router.post("/users/create", UserController.createUser);
  router.put("/users/update/:id", UserController.updateUser);
  router.delete("/users/delete/:id", UserController.deleteUser);
  return app.use("/api/v1", router);
};

export default initApiRoute;
