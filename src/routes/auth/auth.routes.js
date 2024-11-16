import express from "express";
import AuthController from "../../controller/authController";

const router = express.Router();

router.post("/register", AuthController.handleRegister);
router.post("/login", AuthController.handleLogin);
router.post("/logout", AuthController.handleLogout);

export default router;
