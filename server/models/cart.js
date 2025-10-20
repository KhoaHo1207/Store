const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        image: {
          type: String,
          require: true,
        },
        artName: {
          type: String,
          require: true,
        },
        brand: {
          type: String,
          require: true,
        },
        quantity: {
          type: Number,
          require: true,
        },
        price: {
          type: Number,
          require: true,
        },
      },
    ],
    total: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
