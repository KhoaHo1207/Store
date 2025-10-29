const jwt = require("jsonwebtoken");

const generateToken = ({ email, fullName, role }) => {
  const token = jwt.sign({ email, fullName, role }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
  return token;
};

module.exports = { generateToken };
