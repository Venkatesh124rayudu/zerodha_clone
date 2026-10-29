const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  mode: { type: String, enum: ["BUY", "SELL"], required: true },
  OrderTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { OrdersSchema };
