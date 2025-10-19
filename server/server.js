const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const initRoute = require("./routes");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("Siuuuuuuuuuuu");
});

connectDB();
initRoute(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
