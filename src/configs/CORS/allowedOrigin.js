require("dotenv").config();
const allowedOrigins = [
  "*",
  process.env.REACT_PATH,
  process.env.REACT_PATH_SSO,
  "localhost:8080",
  "http://127.0.0.1:8080",
];

module.exports = allowedOrigins;
