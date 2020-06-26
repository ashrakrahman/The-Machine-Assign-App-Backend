const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");
const auth = require("../middleware");
const utils = require("../utils");

const router = express.Router();

// To get all products
router.get("/", auth, (req, res, next) => {
  const user_id = req.decodedData.data.data;
  Product.find({ created_by: user_id })
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

// To get an individual product
router.get("/:productId", auth, (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .exec()
    .then(result => {
      return utils.genericResponse(res, 200, "Success!", result);
    })
    .catch(err => {
      return utils.genericResponse(res, 500, "An Error Occured!", err);
    });
});

// To save a new product entry
router.post("/", auth, (req, res, next) => {
  const user_id = req.decodedData.data.data;
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    type: req.body.type,
    price: req.body.price,
    created_by: user_id
  });

  product
    .save()
    .then(result => {
      console.log(result);
      return utils.genericResponse(
        res,
        201,
        "Product created successfully!",
        result
      );
    })
    .catch(err => {
      return utils.genericResponse(res, 500, "An Error Occured!", err);
    });
});

// To update an existing product info
router.patch("/:productId", auth, (req, res, next) => {
  const productId = req.params.productId;
  const user_id = req.decodedData.data.data;
  Product.update(
    { _id: productId },
    {
      $set: {
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        created_by: user_id
      }
    }
  )
    .exec()
    .then(result => {
      return utils.genericResponse(
        res,
        202,
        "Product updated successfully!",
        result
      );
    })
    .catch(err => {
      console.log(err);
      return utils.genericResponse(res, 500, "An Error Occured!", err);
    });
});

module.exports = router;
