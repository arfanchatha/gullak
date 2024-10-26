const AppError = require("../errorHandling/appError");
const Commetti = require("../models/commettiModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const APIFeatures = require("../utils/apiFeatures");

exports.getAllCommetties = async (req, res) => {
  try {
    const features = new APIFeatures(Commetti.find(), {
      ...req.query,
      user: req.user._id,
    })
      .filter()
      .sort()
      .selectFields()
      .paginate();

    const commettis = await features.mongoQuery.select("-user").populate({
      path: "transaction",
      // select: "createdAt participant commetti amount month postedBy",
    });

    res.status(200).json({
      status: "success",
      numCommettis: commettis.length,
      data: { commettis },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getOnlyCommettiesWithParticipants = async (req, res) => {
  try {
    const features = new APIFeatures(Commetti.find(), {
      ...req.query,
      user: req.user._id,
    })
      .filter()
      .sort()
      .selectFields()
      .paginate();

    const commettis = await features.mongoQuery;

    res.status(200).json({
      status: "success",
      numCommettis: commettis.length,
      data: { commettis },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getCommetti = async (req, res, next) => {
  try {
    const commetti = await Commetti.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate({
      path: "transaction",
      select: "createdAt participant commetti amount month paidAmount",
    });

    if (!commetti) {
      return next(new AppError("Commetti not found", 404));
    }

    res.status(200).json({
      status: "success",
      totalParticipants: commetti?.participant?.length,

      data: { commetti },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createCommetti = async (req, res) => {
  try {
    const { user, ...commettiData } = req.body;

    const userData = [...user, req.user._id.toString()];

    console.log(userData);

    const commetti = await Commetti.create({
      user: [...user, req.user._id.toString()],
      ...commettiData,
    });

    res.status(201).json({
      status: "created",
      data: { commetti },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "You already have a commetti with that name.",
      });
    }
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.updateCommetti = async (req, res, next) => {
  try {
    const commetti = await Commetti.findOneAndUpdate(
      { _id: req.params.id, user: mongoose.Types.ObjectId(req.user._id) },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!commetti) {
      return next(new AppError("Commetti not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { commetti },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
