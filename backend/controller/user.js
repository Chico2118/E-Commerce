const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const { nextTick } = require("process");
const user = require("../model/user");
router.post(
  "/create-user",
  upload.single("file"),
  catchasyncErrors(async (req, res) => {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      if (req.file) {
        const filepath = path.join(__dirname, "../uploads", req.file.filename);
        try {
          fs.unlinkSync(filepath);
        } catch (err) {
          console.log("Error Removing File:", err);
          return res.status(500).json({ message: "Error removing file" });
        }
      }
      return nextTick(new ErrorHandler("User Already Exists:", 400));
    }
    let fileUrl = "";
    if (req.file) {
      fileUrl = path.join("uploads", req.file.filename);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("At create", "Password:", password, "Hash:", hashedPassword);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      avatar: {
        public_id: req.file?.filename || "",
        url: fileUrl,
      },
    });
    console.log(user);
    res
      .status(201)
      .json({ message: "User Created Successfully", success: true, user });
  })
);

router.post(
  "/login",
  catchAsyncErrors(async (req, res, nex) => {
    console.log("Creating user....");
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please provide credentials!", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("At auth", "Password:", password, "Hash:", user.password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    user.password = undefined;
    res.status(200).json({
      success: true,
      user,
    });
  })
);

module.exports = router;
