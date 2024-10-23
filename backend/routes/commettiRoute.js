const express = require("express");

const router = express.Router();

const commettiController = require("../controllers/commettiController");
const authController = require("../controllers/authController");
const transactionRouter = require("./transactionRoute");

router.use("/:commettiId/transactions", transactionRouter);

router
  .route("/")
  .get(authController.protect, commettiController.getAllCommetties)
  .post(
    authController.protect,
    authController.restricTo("admin"),
    commettiController.createCommetti
  );

router
  .route("/get-commettis-with-participants")
  .get(
    authController.protect,
    commettiController.getOnlyCommettiesWithParticipants
  );

router
  .route("/:id")
  .get(authController.protect, commettiController.getCommetti)
  .patch(
    authController.protect,
    authController.restricTo("admin"),
    commettiController.updateCommetti
  );

module.exports = router;
