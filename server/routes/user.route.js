const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
  updateProfile,
} = require("../controllers/user.controller");
const { protect } = require("../middlewares/checkRole");

router.post("/register", register);
router.post("/login", login);
router.get("/currentUser", protect, getCurrentUser);
router.put("/profile", protect, updateProfile);
module.exports = router;
