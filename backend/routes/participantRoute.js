const express = require("express");

const router = express.Router();

const participantController = require("../controllers/participantController");
const authController = require("../controllers/authController");

router
  .route("/onlyparticipants")
  .get(authController.protect, participantController.getOnlyParticipants);

router
  .route("/")
  .get(authController.protect, participantController.getAllParticipants)
  .post(
    authController.protect,
    authController.restricTo("admin"),
    participantController.createParticipant
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.restricTo("admin"),
    participantController.getParticipant
  );

module.exports = router;
