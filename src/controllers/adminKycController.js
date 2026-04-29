const Onboarding = require("../models/Onboarding");
const Document = require("../models/Document");

// GET pending KYC users
exports.getPendingKycUsers = async (req, res) => {
  try {
    const users = await Onboarding.find({})
  .populate("userId", "email phone")
  .populate("accountId", "name country")
  .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET single user KYC details
exports.getUserKycDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const onboarding = await Onboarding.findOne({ userId })
      .populate("userId", "email phone")
      .populate("accountId", "name country");

    if (!onboarding) {
      return res.status(404).json({
        success: false,
        message: "Onboarding data not found"
      });
    }

    const documents = await Document.find({
      userId,
      accountId: onboarding.accountId._id
    });

    res.json({
      success: true,
      data: {
        onboarding,
        documents
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// APPROVE / REJECT KYC
exports.updateKycStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be approved or rejected"
      });
    }

    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    const onboarding = await Onboarding.findOne({ userId });

    if (!onboarding) {
      return res.status(404).json({
        success: false,
        message: "Onboarding data not found"
      });
    }

    onboarding.kycStatus = status;
    onboarding.accountStatus = status === "approved" ? "active" : "pending";
    onboarding.rejectionReason = status === "rejected" ? rejectionReason : "";

    onboarding.documents = onboarding.documents.map((doc) => ({
      ...doc.toObject(),
      status
    }));

    await onboarding.save();

    await Document.updateMany(
      {
        userId,
        accountId: onboarding.accountId
      },
      {
        status
      }
    );

    res.json({
      success: true,
      message:
        status === "approved"
          ? "KYC approved successfully"
          : "KYC rejected successfully",
      data: onboarding
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};