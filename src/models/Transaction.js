// const mongoose = require("mongoose");

// const transactionSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },

//   accountId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Account",
//     required: true
//   },

//   transactionId: {
//     type: String,
//     required: true,
//     unique: true
//   },

//   customer: {
//     type: String,
//     required: true
//   },

//   amount: {
//     type: Number,
//     required: true
//   },

//   method: {
//     type: String,
//     enum: ["UPI", "Card", "Netbanking"],
//     required: true
//   },

//   status: {
//     type: String,
//     enum: ["Success", "Failed", "Pending"],
//     default: "Pending"
//   },

//   date: {
//     type: Date,
//     default: Date.now
//   }
// }, { timestamps: true });

// module.exports =
//   mongoose.models.Transaction ||
//   mongoose.model("Transaction", transactionSchema);




const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },

  transactionId: {
    type: String,
    required: true,
    unique: true
  },

  customer: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  },

  method: {
    type: String,
    enum: ["UPI", "Card", "Netbanking"],
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },

  description: String,

  paymentRef: String,

  failureReason: String

}, { timestamps: true });

// 🔥 performance index
transactionSchema.index({ userId: 1, accountId: 1 });

module.exports =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);