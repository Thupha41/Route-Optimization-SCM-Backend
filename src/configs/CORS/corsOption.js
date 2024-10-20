require("dotenv").config();
import allowedOrigins from "./allowedOrigin";
const configCors = (app) => {
  //check if the origin is allowed
  const isAllowedOrigin = (origin) => {
    return allowedOrigins.includes(origin) || !origin;
  };
  // Handle CORS headers for preflight OPTIONS requests
  app.options("*", (req, res) => {
    const origin = req.headers.origin;
    if (isAllowedOrigin(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
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
    res.setHeader("Access-Control-Allow-Origin", process.env.REACT_PATH_SSO);
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
