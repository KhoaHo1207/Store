const express = require("express");
const {
  addProduct,
  gettAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getReviewByProductId,
  addReview,
} = require("../controllers/product.controller");
const { protect, authorize } = require("../middlewares/checkRole");
const router = express.Router();

router.post("/", authorize("admin"), addProduct);
router.get("/", protect, gettAllProduct);
router.get("/:id", protect, getProductById);
router.put("/:id", updateProductById);
router.delete("/:id", deleteProductById);

router.get("/:id/review", protect, getReviewByProductId);
router.post("/:id/review", protect, addReview);
module.exports = router;
