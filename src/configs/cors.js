require("dotenv").config();

const configCors = (app) => {
  // Handle CORS headers for preflight OPTIONS requests
  app.options("*", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.REACT_PATH);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type,Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.sendStatus(200); // Response for OPTIONS request
  });

  // Middleware for all requests
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", process.env.REACT_PATH);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type,Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });
};

export default configCors;
