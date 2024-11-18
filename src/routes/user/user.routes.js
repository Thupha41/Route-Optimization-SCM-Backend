import express from "express";
import UserController from "../../controller/userController";

const router = express.Router();

router.get("/read", UserController.getListUser);
router.post("/create", UserController.createUser);
router.put("/update/:id", UserController.updateUser);
router.delete("/delete/:id", UserController.deleteUser);
router.get("/search", UserController.searchUser);
router.get("/account", UserController.getUserAccount);
router.delete("/bulk-delete", UserController.bulkDeleteUsers);
router.put("/bulk-update", UserController.bulkUpdateUsers);

export default router;
