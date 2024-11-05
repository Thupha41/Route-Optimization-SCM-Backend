import db from "../models/index";

const methodMappers = {
  "GET": "Fetching",
  "POST": "Adding",
  "PUT": "Updating",
  "DELETE": "Deleting"
}

exports.auditLogMiddleware = (req, res, next) => {
  try {
    const originalJson = res.json;
    res.json = async function (body){
      await db.AuditLog.create({
        url: req.originalUrl,
        activity: methodMappers[req.method] + ' ' + req.originalUrl.split("/")[req.originalUrl.split("/").length - 1] || "",
        params: JSON.stringify(req.params),
        query: JSON.stringify(req.query),
        payload: JSON.stringify(req.body),
        response: "EC: " + JSON.stringify(body.EC)
      });
      return originalJson.call(this,body);
    }

    next();
  } catch(error) {
    console.log("Error in auditLogging middleware");
    console.log(error.message);
    next();
  }
}