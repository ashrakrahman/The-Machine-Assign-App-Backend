const User = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const utils = require("../utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware");

const router = express.Router();

// To register a user
router.post("/registration", async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!utils.isValidEmail(email)) {
    return utils.genericResponse(res, 400, "Email is not Valid!.", null);
  }

  if (typeof password !== "string") {
    return utils.genericResponse(res, 400, "Password must be a string.", null);
  }
  // Check if this user already exisits
  let user = await User.findOne({ username: username });

  if (user) {
    return utils.genericResponse(res, 400, "That user already exisits!", null);
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      email: email,
      password: hashedPassword
    });

    user
      .save()
      .then(result => {
        console.log(result);
        return utils.genericResponse(
          res,
          201,
          "User created successfully!",
          result
        );
      })
      .catch(err => {
        console.log(err);
        return utils.genericResponse(res, 500, "An Error Occured!", err);
      });
  }
});

// To login a user
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (typeof password !== "string") {
      return utils.genericResponse(
        res,
        400,
        "Password must be a string!",
        null
      );
    }
    // queries database to find a user with the received username
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error();
    }

    // using bcrypt to compare passwords
    const passwordValidated = await bcrypt.compare(password, user.password);
    if (!passwordValidated) {
      throw new Error();
    }
    const access_token = jwt.sign(
      {
        data: user.id
      },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE_SPAN }
    );

    const refresh_token = jwt.sign(
      {
        data: user.username
      },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE_SPAN }
    );
    await User.updateOne(
      { _id: user.id },
      {
        $set: { access_token: access_token, refresh_token: refresh_token }
      }
    );
    const data = {
      user_id: user.id,
      access_token: access_token,
      expires_in: process.env.JWT_ACCESS_TOKEN_LIFE_SPAN,
      refresh_token: refresh_token
    };

    return utils.genericResponse(res, 200, "Login Successful!", data);
  } catch (err) {
    return utils.genericResponse(res, 400, "Invalid Credentials!", err);
  }
});

// To get an individual user info
router.get("/info", auth, async (req, res, next) => {
  const user_id = req.decodedData.data.data;
  await User.findById(user_id)
    .exec()
    .then(result => {
      data = {
        id: result.id,
        username: result.username,
        email: result.email,
        access_token: result.access_token
      };
      return utils.genericResponse(res, 200, "Success", data);
    })
    .catch(err => {
      return utils.genericResponse(res, 500, "An Error Occured!", err);
    });
});

// To get a new Access Token by providing valid refresh token
router.post("/refresh", auth, async (req, res, next) => {
  const username = req.decodedData.data.data;
  await User.findOne({ username })
    .then(result => {
      const access_token = jwt.sign(
        {
          data: result.id
        },
        process.env.SECRET_KEY,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE_SPAN }
      );
      const userId = result.id;
      try {
        return utils.updateUserAccessToken(userId, access_token);
      } catch (err) {
        return utils.genericResponse(res, 400, "An Error Occured!", err);
      }
    })
    .catch(err => {
      return utils.genericResponse(res, 500, "An Error Occured!", err);
    });
  const userInfo = await User.findOne({ username });

  const data = {
    access_token: userInfo.access_token,
    expires_in: process.env.JWT_ACCESS_TOKEN_LIFE_SPAN
  };

  return utils.genericResponse(res, 200, "Success", data);
});

module.exports = router;
