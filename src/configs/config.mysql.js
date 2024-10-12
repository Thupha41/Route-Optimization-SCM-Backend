const mysql = require("mysql2/promise");
require("dotenv").config();
const Sequelize = require("sequelize");
const {
  development: { host, username, password, database, port, dialect },
} = require("./config");
// Create MySQL connection pool
const connection = mysql.createPool({
  host: host,
  user: username,
  port: port,
  database: database,
  password: password,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: "utf8mb4",
});

// Connect to database with Sequelize
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect,
  port: port,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = { connection, sequelize };
