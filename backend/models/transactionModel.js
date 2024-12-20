const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.ObjectId,
      ref: "Participant",
      required: [true, "Review must belong to a user"],
    },
    commetti: {
      type: mongoose.Schema.ObjectId,
      ref: "Commetti",
      required: [true, "Must have commetti ID"],
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      // required: [true, "Must have user ID"],
    },
    amount: { type: Number, required: [true, "Must enter the amount"] },
    month: String,
    date: Date,
    createdAt: { type: Date, default: new Date().toISOString() },
    paidAmount: Number,
    paymentDate: Date,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

transactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "postedBy",
    select: "name",
  });
  next();
});
transactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "commetti",
    select: "name status -participant -user",
  });
  next();
});
transactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "participant",
    select: "name ",
  });
  next();
});
transactionSchema.pre("save", async function (next) {
  const transaction = this;

  const existingTransaction = await mongoose.models.Transaction.findOne({
    commetti: transaction.commetti,
    participant: transaction.participant,
    month: transaction.month,
  });

  if (existingTransaction) {
    const error = new Error(
      `A transaction for the selected participant for the same month already exists, please change the month or participant`
    );
    next(error);
  } else {
    next();
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
