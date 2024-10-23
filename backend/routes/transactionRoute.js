const express = require("express");

const transactionController = require("../controllers/transactionController");
const authController = require("../controllers/authController");
const commettiController = require("../controllers/commettiController");
const router = express.Router({ mergeParams: true });

router
  .route("/received-for-current-month/:commettiId/:month")
  .get(
    authController.protect,
    transactionController.userCommettiandIfTransaction,
    transactionController.receivedForCurrentMonth,
    transactionController.getAllTransactions
  );
router
  .route("/get-transactions-by-commetti/:commettiId")
  .get(
    authController.protect,
    transactionController.userCommettiandIfTransaction,
    transactionController.getTransactionsByCommetti,
    transactionController.getAllTransactions
  );
router
  .route("/commetti-paid/:commettiId")
  .get(
    authController.protect,
    transactionController.userCommettiandIfTransaction,
    transactionController.paidCommetti,
    transactionController.getAllTransactions
  );
router
  .route("/stats")
  .get(authController.protect, transactionController.getTransactionsStats);

router
  .route("/find-participant-with-commetti/:mobile/:cnic")
  .get(transactionController.getParticipantWithCommetti);

// router
//   .route("/participant-transactions")
//   .get(transactionController.getTransactionsByParticipant);

router
  .route("/")
  .get(authController.protect, transactionController.getAllTransactions)
  .post(
    authController.protect,
    authController.restricTo("admin", "assistant"),
    transactionController.createTransaction
  );

router
  .route("/:commettiId/:transactionId")
  .get(
    authController.protect,
    transactionController.userCommettiandIfTransaction,
    transactionController.getTransaction
  )
  .patch(
    authController.protect,
    transactionController.userCommettiandIfTransaction,
    authController.restricTo("admin"),
    transactionController.updateTransaction
  )
  .delete(
    authController.protect,
    transactionController.userCommettiandIfTransaction,
    authController.restricTo("admin"),
    transactionController.deleteTransaction
  );

module.exports = router;
