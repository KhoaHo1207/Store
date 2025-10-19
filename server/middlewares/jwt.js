const jwt = require("jsonwebtoken");

const generateToken = ({ email, username, role }) => {
  const token = jwt.sign({ email, username, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

module.exports = { generateToken };
