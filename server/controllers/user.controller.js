const User = require("../models/user.model");
const Favorite = require("../models/favorite.model");
const Review = require("../models/review.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middlewares/jwt");
const { getDefaultAvatar } = require("../utils/avatar");

const register = async (req, res) => {
  const { email, fullName, password } = req.body;
  if (!email || !fullName || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const isExisted = await User.findOne({ email });
    if (isExisted) {
      return res.status(409).json({
        success: false,
        message: "Email has been already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassord = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      fullName,
      password: hashedPassord,
      avatar: getDefaultAvatar(fullName),
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("something went wrong", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
    });
  } catch (error) {
    console.log("Something went wrong while login", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    const [favorites, reviews] = await Promise.all([
      Favorite.find({ userId }),
      Review.find({ userId }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Get current user successfully",
      data: {
        inform: user,
        favorites,
        reviews,
      },
    });
  } catch (error) {
    console.error("Something went wrong while getting current user", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { fullName, avatar, phone, address } = req.body;

    if (fullName) {
      user.fullName = fullName;
    }

    if (avatar) {
      user.avatar = avatar;
    }
    if (phone) {
      user.phone = phone;
    }
    if (address) {
      user.address = address;
    }
    const updatedUser = await user.save();
    return res.status(200).json({
      success: true,
      message: "Update profile successfully",
      data: {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    console.log("Somwthing went error while update profile", error);
    rs.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { register, login, getCurrentUser, updateProfile };
