const AppError = require("../errorHandling/appError");
const User = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ admin: req.user._id }).select(
      "name email role active id"
    );

    res.status(200).json({
      status: "success",
      data: { users },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email id ");

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { password, passwordConfirm, name, email, commetti } = req.body;

    if (password || passwordConfirm) {
      return next(new AppError("This route in not for password update", 400));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, commetti },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(
        new AppError("You are not logged in, please log in first", 401)
      );
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
