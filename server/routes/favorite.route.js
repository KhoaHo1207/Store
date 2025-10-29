const express = require("express");
const router = express.Router();
const {
  addFavorite,
  getFavorite,
} = require("../controllers/favorite.controller");
const { protect } = require("../middlewares/checkRole");

router.get("/", protect, getFavorite);
router.put("/", protect, addFavorite);
module.exports = router;
