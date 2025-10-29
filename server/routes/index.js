const userRoute = require("./user.route");
const productRoute = require("./product.route");
const uploadRoute = require("./upload.route");
const favoriteRoute = require("./favorite.route");
const initRoute = (app) => {
  app.use("/api/auth", userRoute);
  app.use("/api/product", productRoute);
  app.use("/api/upload", uploadRoute);
  app.use("/api/favorite", favoriteRoute);
};

module.exports = initRoute;
