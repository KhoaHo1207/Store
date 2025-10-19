const express = require("express");
const {
  addProduct,
  gettAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} = require("../controllers/product.controller");
const { protect, authorize } = require("../middlewares/checkRole");
const router = express.Router();

router.post("/", authorize("admin"), addProduct);
router.get("/", gettAllProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProductById);
router.delete("/:id", deleteProductById);
module.exports = router;
