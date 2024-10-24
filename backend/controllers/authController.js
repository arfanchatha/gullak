const { promisify } = require("util");
const User = require("../models/userModel");
const AppError = require("../errorHandling/appError");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { emailTransporter } = require("../utils/emailTransporter");

const signJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
};

exports.signup = async (req, res) => {
  try {
    if (req.user) {
      req.body = { admin: req.user?._id, role: "assistant", ...req.body };
    }
    // const { name, email, password, passwordConfirm, role = "admin" } = req.body;

    const user = await User.create({
      ...req.body,
    });

    const token = signJWT(user._id);

    user.password = undefined;

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }

    // res.cookie("jwt", token, cookieOptions);

    res.status(201).json({ status: "success", data: { user } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Email or password incorrect", 401));
    }

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }

    const token = signJWT({ id: user._id, name: user.name, role: user.role });
    console.log("hitted log in");

    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({ status: "success", message: "logged in", token });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.logout = (req, res) => {
  const token = jwt.sign({ id: "loggedout" }, "loggedout", {
    expiresIn: 1,
  });
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 3 * 1000),

    httpOnly: true,
    secure: true,
  });

  res.status(200).json({ message: "success", token });
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  let decodeJWT;
  try {
    decodeJWT = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(
      new AppError("You are not logged in, please log in first", 401)
    );
  }

  const loggedInUser = await User.findOne({ _id: decodeJWT?.id.id }).populate({
    path: "commetti",
    select: "name id",
  });

  if (!loggedInUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  if (
    loggedInUser.passwordChanged(decodeJWT.iat, loggedInUser.passwordChangedAt)
  ) {
    return next(
      new AppError("User recently changed password, please login again", 401)
    );
  }

  req.user = loggedInUser;

  next();
};

// exports.isLoggedIn = async (req, res, next) => {
//   if (req.cookies.jwt) {
//     const decodeJWT = await promisify(jwt.verify)(
//       token,
//       process.env.JWT_SECRET
//     );

//     const loggedInUser = await User.findById(decodeJWT?.id);
//     if (!loggedInUser) {
//       return next();
//     }

//     if (
//       loggedInUser.passwordChanged(
//         decodeJWT.iat,
//         loggedInUser.passwordChangedAt
//       )
//     ) {
//       return next();
//     }

//     res.status(200).json({
//       status: "success",
//       user: loggedInUser.name,
//     });
//     next();
//   }
//   next();
// };

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 401)
      );
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new AppError("There is no account associated with this email", 404)
      );
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const subject = "Reset password expires in (10 minutes)";
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetpassword/${resetToken}`;
    const message = `Please follow the link to reset password \n ${resetURL}`;

    const mailOptions = {
      from: "test@email.com",
      to: user.email,
      subject,
      text: message,
    };

    await emailTransporter.sendMail(mailOptions);

    res.status(200).json({ status: `Token sent to ${user.email}` });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        `Email sending failed, please try again later!!, ${err.message}`,
        500
      )
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password, passwordConfirm } = req.body;
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new AppError("Your token is invalid, please forgot password again", 400)
      );
    }

    if ((!password, !passwordConfirm)) {
      return next(
        new AppError("Please provide password and confirm password", 400)
      );
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    const token = signJWT(user._id);

    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    new AppError(err.message, 400);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, password, passwordConfirm } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return next(
        new AppError("You are not logged in, please log in first", 401)
      );
    }
    const correctPass = await user.correctPassword(
      currentPassword,
      user.password
    );

    if (!user || !correctPass) {
      return next(
        new AppError(
          "Your current password is not true, please enter correct password",
          401
        )
      );
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;

    await user.save();

    const token = signJWT(user._id);

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }
    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({
      status: "success",
      message: "Password updated successfuly",
      token,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};
