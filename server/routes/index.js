const userRoute = require("./user.route");
const productRoute = require("./product.route");
const uploadRoute = require("./upload.route");
const favoriteRoute = require("./favorite.route");
const chatRoute = require("./chat.route");
const initRoute = (app) => {
  app.use("/api/auth", userRoute);
  app.use("/api/product", productRoute);
  app.use("/api/upload", uploadRoute);
  app.use("/api/favorite", favoriteRoute);
  app.use("/api/chat", chatRoute);
};

module.exports = initRoute;
