const AppError = require("../errorHandling/appError");
const mongoose = require("mongoose");
const Transaction = require("../models/transactionModel");
const Commetti = require("../models/commettiModel");
const APIFeatures = require("../utils/apiFeatures");
const { getParticipantByMobileAndCnic } = require("./participantController");

exports.userCommettiandIfTransaction = async (req, res, next) => {
  try {
    const { transactionId, commettiId } = req.params;

    if (!commettiId)
      return next(new AppError("Please enter the commettiId", 404));

    const commetti = await Commetti.findOne({
      _id: req.params.commettiId,
      user: mongoose.Types.ObjectId(req.user._id),
    })
      .populate("transaction")
      .lean();

    if (!commetti) {
      return next(new AppError("Commetti not found", 404));
    }

    if (!transactionId) return next();

    const transaction = commetti?.transaction?.find(
      ({ _id }) => _id.toString() === transactionId
    );

    if (!transaction) {
      return next(new AppError("Transaction not found", 404));
    }

    next();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.receivedForCurrentMonth = (req, res, next) => {
  req.query.month = req.params.month;
  req.query.commetti = req.params.commettiId;
  req.query.fields = "participant,amount,date,commetti";
  req.query.sort = "-date";

  next();
};
exports.getTransactionsByCommetti = (req, res, next) => {
  req.query.commetti = req.params.commettiId;

  next();
};

exports.paidCommetti = (req, res, next) => {
  req.query.paidAmount = { gt: 0 };
  req.query.commetti = req.params.commettiId;
  req.query.fields = "paidAmount,paymentDate, participant, name";
  req.query.sort = "-date";

  next();
};

exports.getAllTransactions = async (req, res) => {
  try {
    if (req.params.commettiId) req.query.commetti = req.params.commettiId;
    const apiFeatures = new APIFeatures(Transaction.find(), req.query)
      .filter()
      .sort()
      .selectFields()
      .paginate();

    const transactions = await apiFeatures.mongoQuery;
    // .populate("user")
    // .populate("participant")
    // .populate("commetti");

    res.status(200).json({
      status: "success",
      totalTransactions: transactions.length,
      data: { transactions },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { transaction },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const { commettiId } = req.params;

    const userCommettiData = req.user.commetti;

    const hasCommetti = userCommettiData.find((data) => data.id === commettiId);

    if (!hasCommetti) {
      return next(
        new AppError(
          `You do not have any commetti with this id: (${commettiId})`,
          404
        )
      );
    }

    const newTransactions = await Transaction.create({
      postedBy: req.user._id,
      commetti: commettiId,
      ...req.body,
    });

    res.status(200).json({
      status: "success",
      data: { postedTransaction: newTransactions },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(201).json({
      status: "success",
      data: { updatedTransaction },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    await Transaction.findByIdAndDelete(req.params.transactionId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTransactionsStats = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { amount: { $gte: 10000 } } },

      {
        $group: {
          _id: "$participantId",
          totalReceived: { $sum: "$amount" },
          paidAmount: { $sum: "$paidAmount" },
          months: { $count: {} },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: { stats },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getParticipantWithCommetti = async (req, res, next) => {
  try {
    const { mobile, cnic } = req.params;

    const foundParticipant = await getParticipantByMobileAndCnic(mobile, cnic);

    const participantCommetti = await Commetti.find({
      participant: foundParticipant._id,
      // status: "inProgress",
    })
      .populate({
        path: "transaction",
        select:
          "createdAt participant commetti amount month paidAmount paymentDate date",
      })
      .select("-user -participant");

    res.status(200).json({
      status: "success",

      data: {
        member: foundParticipant,
        commetti: participantCommetti,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
