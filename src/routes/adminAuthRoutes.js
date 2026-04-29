const express = require("express");
const router = express.Router();

const {
  adminLogin,
  adminProfile
} = require("../controllers/adminAuthController");

const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/login", adminLogin);
router.get("/profile", adminMiddleware, adminProfile);

module.exports = router;