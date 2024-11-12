import {
  createNewUser,
  getListUser,
  deleteUser,
  editUser,
  getUserById,
} from "../services/userService";

const getHomePage = async (req, res) => {
  return res.render("home.ejs");
};
const getUserPage = async (req, res) => {
  try {
    const listUser = (await getListUser()) || [];
    return res.render("user.ejs", {
      listUser: listUser,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(">>> error: ", error);
    return res.render("user.ejs", {
      listUser: [],
      error: "Error fetching users",
      success: "",
    });
  }
};
const postCreateUser = async (req, res) => {
  const { email, password, username } = req.body;

  await createNewUser(email, password, username);
  return res.redirect("/user");
};
const handleDeleteUser = async (req, res) => {
  const userId = req.params.id;
  if (!userId) return;
  await deleteUser(userId);
  return res.redirect("/user");
};

const getEditUserPage = async (req, res) => {
  let id = req.params.id;
  let userData = {};
  let user = await getUserById(id);
  userData = user;

  return res.render("user-edit.ejs", { userData });
};

const handleEditUser = async (req, res) => {
  const { email, username, id } = req.body;
  console.log("Check id: ", req.body.id);
  await editUser(email, username, id);
  return res.redirect("/user");
};
module.exports = {
  getHomePage,
  getUserPage,
  postCreateUser,
  handleDeleteUser,
  handleEditUser,
  getEditUserPage,
};
