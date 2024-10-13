import express from "express";
import {
  getHomePage,
  getUserPage,
  postCreateUser,
  handleDeleteUser,
  getEditUserPage,
  handleEditUser,
} from "../controller/homeController";
import { testApi } from "../controller/authController";
const router = express.Router();

router.get("/", getHomePage);
router.get("/user", getUserPage);
router.post("/user/create-user", postCreateUser);
router.post("/delete-user/:id", handleDeleteUser);
router.get("/user/update-user/:id", getEditUserPage);
router.post("/user/update-user", handleEditUser);
router.get("/api/test-api", testApi);
module.exports = router;
