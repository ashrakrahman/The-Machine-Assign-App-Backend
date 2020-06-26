const jwt = require("jsonwebtoken");
const utils = require("./utils");

// Auth middleware to check token validity (both accesss & refresh)
module.exports = async function(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token)
    return utils.genericResponse(res, 401, "No token provided.", null);
  try {
    var decoded = jwt.verify(token, process.env.SECRET_KEY);
    const data = {
      auth: true,
      data: decoded
    };
    req.decodedData = data;
    next();
  } catch (err) {
    // err
    const data = {
      auth: false,
      data: err
    };
    return utils.genericResponse(res, 401, "Invalid Token!", data);
  }
};
