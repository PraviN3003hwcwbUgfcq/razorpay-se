const Onboarding = require("../models/Onboarding");

module.exports = async (req, res, next) => {
  try {
    const onboarding = await Onboarding.findOne({
      userId: req.user.id,
      accountId: req.user.accountId
    });

    if (!onboarding) {
      return res.status(403).json({
        success: false,
        message: "Onboarding not found"
      });
    }

    // ❌ KYC not approved
    if (onboarding.kycStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "KYC approval required"
      });
    }

    // ❌ Account not active
    if (onboarding.accountStatus !== "active") {
      return res.status(403).json({
        success: false,
        message: "Account is not active"
      });
    }

    // ✅ All good
    next();

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};