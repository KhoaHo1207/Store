const Favorite = require("../models/favorite.model");

const addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const { _id } = req.user;
    const userId = _id;
    const existingFavorite = await Favorite.findOne({ userId, productId });

    if (existingFavorite) {
      await Favorite.deleteOne({ _id: existingFavorite._id });
      return res.status(200).json({
        message: "Removed from favorite list",
        success: true,
        isFavorite: false,
      });
    } else {
      const newFavorite = await Favorite.create({ userId, productId });
      return res.status(201).json({
        message: "Added to favorite list",
        success: true,
        isFavorite: true,
        favorite: newFavorite,
      });
    }
  } catch (error) {
    console.log("Soemthing went error while add favorite", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getFavorite = async (req, res) => {
  try {
    const { _id } = req.user;
    const userId = _id;

    const favorites = await Favorite.find({ userId }).populate("productId");

    const mergedFavorites = favorites.map((fav) => {
      const product = fav.productId ? fav.productId.toObject() : {};
      const { _id, productId, ...favData } = fav.toObject();

      return {
        ...favData,
        ...product,
        favoriteId: _id,
        isFavorite: true,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Get favorite successfully",
      data: mergedFavorites,
    });
  } catch (error) {
    console.log("Something went wrong while get favorite:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { addFavorite, getFavorite };
