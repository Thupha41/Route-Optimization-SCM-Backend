const isLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.path === "/login") {
      return res.redirect("/");
    }
    next();
  } else {
    if (req.path === "/login") {
      next();
    } else {
      return res.redirect("/login");
    }
  }
};

export default { isLogin };
