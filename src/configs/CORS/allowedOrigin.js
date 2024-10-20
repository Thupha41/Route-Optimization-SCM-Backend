require("dotenv").config();
const allowedOrigins = [
  "*",
  process.env.REACT_PATH,
  process.env.REACT_PATH_SSO,
];

module.exports = allowedOrigins;
