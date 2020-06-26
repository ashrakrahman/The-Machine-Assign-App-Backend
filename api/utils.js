const jwt = require("jsonwebtoken");
const User = require("../api/models/user");

module.exports = {
  // Check if an email is valid or not
  isValidEmail: function(email) {
    if (typeof email !== "string") {
      return false;
    }
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return emailRegex.test(email);
  },

  // Generic Response for every request
  genericResponse: function(response, status, message, data) {
    return response.status(status).json({
      status: status.toString(),
      message: message,
      data: data
    });
  },

  // To update user access token
  updateUserAccessToken: async function(userId, token) {
    user = await User.updateOne(
      { _id: userId },
      {
        $set: { access_token: token }
      }
    );
    return user;
  }
};
