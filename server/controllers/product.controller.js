const Product = require("../models/product.model");
const Favorite = require("../models/favorite.model");
const Review = require("../models/review.model");
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
    const userId = req.user._id;
    const { brand, search, sort } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const filter = {};

    if (brand) {
      filter.brand = brand;
    }
    if (search) {
      filter.artName = { $regex: search, $options: "i" };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();
    let favoriteProductIds = [];
    if (userId) {
      const favorites = await Favorite.find({ userId }).select("productId");
      favoriteProductIds = favorites.map((f) => f.productId.toString());
    }

    const productsWithFavorite = products.map((product) => ({
      ...product,
      isFavorite: favoriteProductIds.includes(product._id.toString()),
    }));

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
      },
      data: productsWithFavorite,
    });
  } catch (error) {
    console.error("Something went wrong while fetching products", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const product = await Product.findById(id)
      .populate("createdBy", "fullName email avatar phone address")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let isFavorite = false;

    if (userId) {
      const favorite = await Favorite.findOne({ userId, productId: id });
      if (favorite) {
        isFavorite = true;
      }
    }

    const productWithFavorite = { ...product, isFavorite };

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: productWithFavorite,
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

const getReviewByProductId = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await Review.find({ productId: id }).populate(
      "userId",
      "fullName email avatar phone address"
    );
    const product = await Product.findById(id)
      .select("averageRating totalRating")
      .lean();

    return res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: {
        reviews,
        averageRating: product.averageRating || 0,
        totalRating: product.totalRating || 0,
      },
    });
  } catch (error) {
    console.log("Something went wrong while fetching reviews", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { comment, rating } = req.body;

    if (!comment || !rating) {
      return res.status(400).json({
        success: false,
        message: "Comment and rating are required.",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // const existingReview = await Review.findOne({ productId: id, userId });
    // if (existingReview) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You have already reviewed this product.",
    //   });
    // }

    const review = await Review.create({
      productId: id,
      userId,
      comment,
      rating,
    });

    const reviews = await Review.find({ productId: id });

    const totalRating = reviews.length;
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / totalRating;

    product.totalRating = totalRating;
    product.averageRating = Number(averageRating.toFixed(1));

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Review added successfully.",
      data: review,
      // updatedRating: {
      //   averageRating: product.averageRating,
      //   totalRating: product.totalRating,
      // },
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while adding review.",
    });
  }
};

module.exports = {
  addProduct,
  gettAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getReviewByProductId,
  addReview,
};
