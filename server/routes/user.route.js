const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/user.controller");
const { protect } = require("../middlewares/checkRole");

router.post("/register", register);
router.post("/login", login);
router.get("/currentUser", protect, getCurrentUser);
module.exports = router;
