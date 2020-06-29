const express = require("express");
const mongoose = require("mongoose");
const Machine = require("../models/machine");
const auth = require("../middleware");
const utils = require("../utils");

const router = express.Router();

// To get all machines
router.get("/", auth, (req, res, next) => {
  const user_id = req.decodedData.data.data;
  Machine.find({ created_by: user_id })
    .exec()
    .then(result => {
      if (result.length > 0) {
        return utils.genericResponse(res, 200, "Success!", result);
      } else {
        return utils.genericResponse(res, 204, "Not Found!", null);
      }
    })
    .catch(err => {
      return utils.genericResponse(res, 500, "An Error Occured!", err);
    });
});

// To get an individual machine
router.get("/:machineId", auth, (req, res, next) => {
  const machineId = req.params.machineId;
  Machine.findById(machineId)
    .exec()
    .then(result => {
      return utils.genericResponse(res, 200, "Success!", result);
    })
    .catch(err => {
      return utils.genericResponse(res, 500, "An Error Occured!", err);
    });
});

// To save a new machine entry
router.post("/", auth, async (req, res, next) => {
  const user_id = req.decodedData.data.data;
  const checkMachine = await Machine.findOne({ code: req.body.code });
  if (checkMachine) {
    return utils.genericResponse(res, 400, "That code already exisits!", null);
  }
  const machine = new Machine({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    type: req.body.type,
    code: req.body.code,
    created_by: user_id
  });

  machine
    .save()
    .then(result => {
      console.log(result);
      return utils.genericResponse(
        res,
        201,
        "Machine created successfully!",
        result
      );
    })
    .catch(err => {
      return utils.genericResponse(res, 500, "An Error Occured!", err);
    });
});

// To update an existing machine info
router.patch("/:machineId", auth, (req, res, next) => {
  const machineId = req.params.machineId;
  const user_id = req.decodedData.data.data;
  Machine.update(
    { _id: machineId },
    {
      $set: {
        name: req.body.name,
        type: req.body.type,
        code: req.body.code,
        created_by: user_id
      }
    }
  )
    .exec()
    .then(result => {
      return utils.genericResponse(
        res,
        202,
        "Machine updated successfully!",
        result
      );
    })
    .catch(err => {
      console.log(err);
      return utils.genericResponse(res, 500, "An Error Occured!", err);
    });
});

// To delete an individual machine
router.delete("/:machineId", auth, async (req, res, next) => {
  const machineId = req.params.machineId;
  try {
    const result = await Machine.deleteOne({ _id: machineId });
    return utils.genericResponse(res, 200, "Success!", result);
  } catch (err) {
    return utils.genericResponse(res, 500, "An Error Occured!", err);
  }
});

module.exports = router;
