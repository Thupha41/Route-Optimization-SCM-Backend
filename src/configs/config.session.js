import session from "express-session";
import Sequelize from "sequelize";
const {
  development: { host, username, password, database, dialect, port },
} = require("./config");
import passport from "passport";
require("dotenv").config();
const configSession = (app) => {
  // initalize sequelize with session store
  const SequelizeStore = require("connect-session-sequelize")(session.Store);

  // create database, ensure 'sqlite3' in your package.json
  const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: dialect,
    port: port,
    logging: false,
    define: {
      freezeTableName: true,
    },
    timezone: "+07:00",
  });

  const myStore = new SequelizeStore({
    db: sequelize,
  });

  app.use(
    session({
      secret: "keyboard cat",
      store: myStore,
      resave: false, // we support the touch method so per the express-session docs this should be set to false
      proxy: true, // if you do SSL outside of node.
      saveUninitialized: false,
      checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
      expiration: 500 * 1000,
      cookie: {
        expires: 500 * 1000,
      },
    })
  );
  // continue as normal
  myStore.sync();
  app.use(passport.authenticate("session"));

  //   mã hóa: format thông tin
  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      //   cb(null, { id: user.id, username: user.username });
      cb(null, user);
    });
  });

  // giải mã: đọc thông tin format
  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};

export default configSession;
