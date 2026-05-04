const express = require("express");
const router = express.Router();


const auth = require("../middleware/authMiddleware");
const checkActiveAccount = require("../middleware/checkActiveAccount");

router.get("/access-check", auth, checkActiveAccount, (req, res) => {
  res.json({
    success: true,
    message: "Account is active"
  });
});


const {
  getAccounts,
  createAccount,
  selectAccount
} = require("../controllers/accountController");

router.get("/", auth, getAccounts);
router.post("/create", auth, createAccount);
router.post("/select", auth, selectAccount);

module.exports = router;