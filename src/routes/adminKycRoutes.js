const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getPendingKycUsers,
  getUserKycDetails,
  updateKycStatus
} = require("../controllers/adminKycController");

router.get("/pending", adminMiddleware, getPendingKycUsers);
router.get("/user/:userId", adminMiddleware, getUserKycDetails);
router.patch("/user/:userId/status", adminMiddleware, updateKycStatus);

module.exports = router;