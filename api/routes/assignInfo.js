const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const AssignInfo = require("../models/assignInfo");
const utils = require("../utils");
const auth = require("../middleware");

router.post("/", auth, async (req, res, next) => {
  const user_id = req.decodedData.data.data;
  const operator_id = req.body.operator_id;
  const machine_id = req.body.machine_id;
  const shift = req.body.shift;
  const assigned_date = req.body.assigned_date;

  let checkValidity = await AssignInfo.find({
    operator_id: operator_id,
    machine_id: machine_id,
    shift: shift,
    assigned_date: assigned_date
  });

  if (checkValidity.length === 0) {
    const assignInfo = new AssignInfo({
      _id: new mongoose.Types.ObjectId(),
      operator_id: operator_id,
      operator_name: req.body.operator_name,
      machine_id: machine_id,
      machine_code: req.body.machine_code,
      shift: shift,
      assigned_date: assigned_date,
      created_by: user_id
    });

    let shiftInfo = "";
    if (shift === "shift_a") {
      shiftInfo = " SHIFT A : 6AM-2PM ";
    } else if (shift === "shift_b") {
      shiftInfo = " SHIFT B : 2PM-10PM ";
    } else {
      shiftInfo = " SHIFT C : 10PM-6AM ";
    }

    const successMessage =
      "Machine : " +
      req.body.machine_code +
      " assigned to Operator: " +
      req.body.operator_name +
      " on Date - " +
      assigned_date +
      " , Shift - " +
      shiftInfo;

    await assignInfo
      .save()
      .then(result => {
        console.log(result);
        return utils.genericResponse(res, 201, successMessage, result);
      })
      .catch(err => {
        return utils.genericResponse(res, 500, "An Error Occured!", err);
      });
  } else {
    return utils.genericResponse(
      res,
      400,
      "Already assigned an operator for this machine!",
      null
    );
  }
});

// To get all assign list : sort by assigned date
router.get("/all", auth, async (req, res, next) => {
  const user_id = req.decodedData.data.data;
  await AssignInfo.find({ created_by: user_id })
    .sort({ assigned_date: -1 })
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

// To get all operator list : filter by dates and sort by assigned date
router.post("/operator-list", auth, async (req, res, next) => {
  const user_id = req.decodedData.data.data;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  console.log(req.body.start_date);
  await AssignInfo.find({
    operator_id: user_id,
    assigned_date: { $gte: new Date(start_date), $lt: new Date(end_date) }
  })
    .sort({ assigned_date: -1 })
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

module.exports = router;
