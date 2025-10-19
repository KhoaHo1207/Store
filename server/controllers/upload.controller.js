const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    console.log(file);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "store",
    });

    fs.unlinkSync(file.path);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
        createdAt: result.created_at,
      },
    });
  } catch (error) {
    console.log("Something went wrong while uploading image", error);
    return res.status(500).json({
      success: false,
      message: "Internal Error Server",
    });
  } finally {
    try {
      if (file && file.path) await fs.unlink(file.path);
    } catch (error) {
      console.warn("Failed to remove temp file", file.path, error);
    }
  }
};

module.exports = { uploadImage };
