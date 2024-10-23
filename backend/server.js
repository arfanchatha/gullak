const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(
    `App running on port ${port}...`,
    process.env.NODE_ENV === "development" ? "in development" : "in production"
  );
});
