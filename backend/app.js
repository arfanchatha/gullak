const express = require("express");
const AppError = require("./errorHandling/appError");
const globalErrorHandling = require("./errorHandling/errorController");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? true
        : "https://gullak.mildcoders.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1); // Enables trusting first proxy for render hosting

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

app.use("/api", limiter);

const transactionRouter = require("./routes/transactionRoute");

const participantRouter = require("./routes/participantRoute");

const userRouter = require("./routes/userRoute");
const commettiRouter = require("./routes/commettiRoute");

app.use((req, res, next) => {
  // console.log("app.js", req.cookies);
  next();
});

app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/participants", participantRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/commetti", commettiRouter);

app.all("*", (req, res, next) => {
  const err = new AppError(
    `This route ${req.originalUrl} is not found on this server`,
    404
  );

  next(err);
});

app.use(globalErrorHandling);

module.exports = app;
