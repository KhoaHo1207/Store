const Product = require("../models/product.model");

const addProduct = async (req, res) => {
  const {
    artName,
    price,
    description,
    glassSurface,
    image,
    brand,
    limitedTimeDeal,
  } = req.body;
  if (
    artName === undefined ||
    price === undefined ||
    description === undefined ||
    glassSurface === undefined ||
    image === undefined ||
    brand === undefined ||
    limitedTimeDeal === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const isExisted = await Product.findOne({ artName });
    if (isExisted) {
      return res.status(409).json({
        scuccess: false,
        message: "Product has been already added",
      });
    }
    const createdBy = req.user._id;
    const product = await Product.create({
      artName,
      price,
      description,
      glassSurface,
      image,
      brand,
      limitedTimeDeal,
      createdBy,
    });
    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    console.log("Something went wrong while adding product", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const gettAllProduct = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.log("Something went wrong while fetching products", error);
    return res.status(500).json({
      success: false,
      message: "Inmernal server error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.log("Something wnt error while fetching product", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.log("Something went wrong while updating product", error);
    return res.statsu(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("SOmething went wrong while deleting product", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = {
  addProduct,
  gettAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
