const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Participant must have name"] },
    mobile: {
      type: String,
      required: [true, "Participant must have mobile number"],
    },
    cnic: {
      type: String,
      required: [true, "Participant must have mobile number"],
    },
    active: { type: Boolean, default: true },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Must have user id"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

participantSchema.index(
  { user: 1, mobile: 1 },
  { unique: [true, "Participant exist with this mobile number"] }
);
participantSchema.index(
  { user: 1, cnic: 1 },
  { unique: [true, "Participant exist with this CNIC"] }
);

participantSchema.virtual("commetti", {
  ref: "Commetti",
  foreignField: "participant",
  localField: "_id",
});

// participantSchema.pre(/^find/, function (next) {
//   console.log("participant", this.options);
//   this.find({ user: mongoose.Types.ObjectId(this.options.user._id) });
//   next();
// });

const Participant = new mongoose.model("Participant", participantSchema);
module.exports = Participant;
