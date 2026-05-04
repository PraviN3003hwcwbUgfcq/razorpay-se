// const express = require("express");
// const router = express.Router();

// const auth = require("../middleware/authMiddleware");


// const {
//   createTransaction,
//   getTransactions
// } = require("../controllers/transactionController");

// router.post("/", auth, createTransaction);
// router.get("/", auth, getTransactions);

// module.exports = router;






const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkActiveAccount = require("../middleware/checkActiveAccount");

const {
  createTransaction,
  getTransactions,
  updateTransactionStatus
} = require("../controllers/transactionController");

router.post("/", auth, checkActiveAccount, createTransaction);
router.get("/", auth, getTransactions);
router.patch("/:id/status", auth, checkActiveAccount, updateTransactionStatus);
module.exports = router;