const Participant = require("../models/participantModel");
const mongoose = require("mongoose");

const APIFeatures = require("../utils/apiFeatures");

exports.getAllParticipants = async (req, res) => {
  try {
    const features = new APIFeatures(Participant.find(), {
      ...req.query,
      user: mongoose.Types.ObjectId(req.user._id),
    })
      .filter()
      .sort()
      .selectFields()
      .paginate();

    const participants = await features.mongoQuery
      .populate({ path: "commetti", select: "name amount" })
      .setOptions({
        user: req.user,
      });
    res.status(200).json({
      status: "success",
      participants: participants?.length,
      data: { participants },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getOnlyParticipants = async (req, res) => {
  try {
    const participants = await Participant.find({
      user: mongoose.Types.ObjectId(req.user._id),
    });

    res.status(200).json({
      status: "success",
      participants: participants?.length,
      data: { participants },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getParticipant = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    res.status(200).json({
      status: "success",

      data: { participant },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createParticipant = async (req, res) => {
  try {
    const participant = await Participant.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json({
      status: "created",
      data: { participant },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getParticipantByMobileAndCnic = async (mobile, cnic) => {
  try {
    const participant = await Participant.findOne({ mobile, cnic }).select(
      "name mobile cnic"
    );

    if (!participant) {
      throw new Error(
        "Participant not found with the provided CNIC and mobile number."
      );
    }
    return participant;
  } catch (err) {
    throw err;
  }
};
