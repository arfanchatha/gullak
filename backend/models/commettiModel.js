const mongoose = require("mongoose");
const AppError = require("../errorHandling/appError");

const commettiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Participant must have name"],
      // unique: true,
    },
    monthlyAmount: {
      type: Number,
      required: [true, "Commetti must have amount"],
    },
    totalAmount: {
      type: Number,
      // required: [true, "Commetti must have amount"],
    },
    durationMonths: {
      type: Number,
      required: [true, "Commetti must have duration in months"],
    },
    startMonth: {
      type: String,
      required: [true, "Commetti must have starting month"],
    },
    endMonth: {
      type: String,
    },
    status: {
      type: String,
      enum: ["inProgress", "completed"],
      default: "inProgress",
      required: [true, "Must have enum with inProgress or completed"],
    },
    participant: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Participant",
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A commetti must belong to an admin"],
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

commettiSchema.index({ user: 1, name: 1 }, { unique: true });

commettiSchema.post("init", function () {
  this.constructor.syncIndexes();
});

commettiSchema.pre("save", function (next) {
  if (this.startMonth && this.durationMonths && this.monthlyAmount) {
    const start = new Date(this.startMonth);

    const end = new Date(start.setMonth(start.getMonth() + this.durationMonths))
      .toISOString()
      .split("-")
      .slice(0, 2)
      .join("-");
    this.endMonth = end;

    this.totalAmount = this.monthlyAmount * this.durationMonths;

    next();
  } else {
    next(
      new Error(
        "Both startMonth and durationMonths are required to calculate endDate"
      )
    );
  }
});

commettiSchema.virtual("transaction", {
  ref: "Transaction",
  foreignField: "commetti",
  localField: "_id",
});

commettiSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});
commettiSchema.pre(/^find/, function (next) {
  this.populate({
    path: "participant",
    select: "name mobile",
  });
  next();
  s;
});

// commettiSchema.pre(/^find/, function (next) {
//   const userCommettiIds = this.options.user?.commetti;
//   const queryId = this.getQuery()._id ? this.getQuery()._id : null;
//   if (!userCommettiIds || userCommettiIds.length === 0) {
//     this.find({ _id: null });
//   } else if (queryId) {
//     if (!userCommettiIds.includes(queryId)) {
//       this.find({ _id: null });
//     } else {
//       this.find({
//         _id: { $in: queryId },
//       });
//     }
//   } else {
//     // For regular find() queries, filter by commetti IDs
//     this.find({
//       _id: { $in: userCommettiIds },
//     });
//   }
//   next();
// });

const Commetti = new mongoose.model("Commetti", commettiSchema);
module.exports = Commetti;
