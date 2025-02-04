const mongoose = require('mongoose');
const financeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
    },
    category: {
      type: String,
      required: true,
      enum: ['salary', 'education', 'health', 'food', 'transportation', 'entertainment', 'utilities', 'others'], 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Finance', financeSchema);