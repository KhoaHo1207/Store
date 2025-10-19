const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controllers/upload.controller");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), uploadImage);

module.exports = router;
