const Product = require("../models/product.model");
require("dotenv").config();

const fetchDynamic = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MODEL = "gemini-2.5-flash";

const callGemini = async (prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetchDynamic(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.error?.message || "Gemini API failed");
    error.status = response.status;
    throw error;
  }

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Xin lỗi, tôi không thể phản hồi ngay bây giờ."
  );
};

const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu nội dung câu hỏi." });
    }

    const products = await Product.find().limit(10).lean();

    const prompt = `
      Bạn là trợ lý AI của cửa hàng tranh nghệ thuật.
      Dưới đây là danh sách sản phẩm từ cơ sở dữ liệu:
      ${JSON.stringify(products, null, 2)}

      Người dùng hỏi: "${message}"
      Hãy trả lời tự nhiên, thân thiện, dựa trên dữ liệu thật.
      Nếu không tìm thấy thông tin phù hợp, hãy nói:
      "Xin lỗi, tôi không tìm thấy thông tin trong hệ thống."
    `;

    const reply = await callGemini(prompt);

    return res.status(200).json({
      success: true,
      reply,
      modelUsed: MODEL,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Đã xảy ra lỗi khi gọi Gemini API",
    });
  }
};

module.exports = { chatWithGemini };
