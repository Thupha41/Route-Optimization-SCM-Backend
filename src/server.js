require("dotenv").config();
import express from "express";
import configViewEngine from "./configs/viewEngine";
import webRoutes from "./routes/web";
import initApiRoute from "./routes/api";
import configCors from "./configs/CORS/corsOption";
import cookieParser from "cookie-parser";
import { configPassport } from "./controller/passportController";
import configSession from "./configs/config.session";
import flash from "connect-flash";
import configLoginWithGoogle from "./controller/googleController";
const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

//config flash
app.use(flash());

//config template engine
configViewEngine(app);

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config cookie parse
app.use(cookieParser());

configSession(app);
//Khai bao config cors
configCors(app);
//Khai bao web route
app.use("/", webRoutes);

// Khai bao api route
initApiRoute(app);

configPassport();
configLoginWithGoogle();
app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
