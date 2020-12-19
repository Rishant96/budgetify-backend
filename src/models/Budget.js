const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: String,
    user: String,
    month: Number,
    items: [
      {
        title: String,
        amount: Number
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", schema);
