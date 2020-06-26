const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  return res.status(200).json({
    version: "1.0.0",
    author: "Ashrak Rahman Lipu",
    description: "Demo backend services."
  });
});

module.exports = router;
