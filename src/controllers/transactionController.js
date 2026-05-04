const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { customer, amount, method, status, date, description  } = req.body;
    if (!req.user.accountId) {
      return res.status(400).json({
        success: false,
        message: "Please select account first"
      });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      accountId: req.user.accountId,
      transactionId: "#TXN" + Date.now(),
      customer,
      amount,
      method,
      status: status || "pending",
      date,
      description,
      currency: "INR"
    });

    res.json({
      success: true,
      transaction
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { search, status, fromDate, toDate } = req.query;

    const filter = {
      userId: req.user.id,
      accountId: req.user.accountId
    };

    if (search) {
      filter.$or = [
        { transactionId: { $regex: search, $options: "i" } },
        { customer: { $regex: search, $options: "i" } }
      ];
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate) filter.date.$lte = new Date(toDate);
    }

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, failureReason } = req.body;

    if (!["pending", "success", "failed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user.id,
      accountId: req.user.accountId
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    transaction.status = status;

    if (status === "failed") {
      transaction.failureReason = failureReason || "";
    }

    await transaction.save();

    res.json({
      success: true,
      transaction
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};