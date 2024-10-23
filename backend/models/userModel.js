const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { type } = require("os");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "A user must have name"] },
    email: {
      type: String,
      required: [true, "Must have email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Must have password"],
      minlength: 4,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Must have passwordConfirm"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Confirm password is not matched",
      },
    },
    passwordChangedAt: { type: Date, default: Date.now() },
    role: {
      type: String,
      enum: ["admin", "assistant"],
      default: "admin",
    },
    passwordResetToken: String,
    passwordResetExpires: String,
    active: { type: Boolean, default: true },
    admin: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("commetti", {
  ref: "Commetti",
  foreignField: "user",
  localField: "_id",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  // bcrypt.hash(this.password, 10, function (err, hash) {
  //   this.password = hash;
  // });
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = function (enteredPassword, savedPassword) {
  return bcrypt.compare(enteredPassword, savedPassword);
};

userSchema.methods.passwordChanged = function (issuedAt, changedAt) {
  return issuedAt < Math.ceil(changedAt.getTime() / 1000);
};

userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

userSchema.pre("findOne", function () {
  this.find({ active: { $ne: false } });
});

// userSchema.pre(this.findOne, function (next) {
//   this.find({ active: { $ne: false } });
//   next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
