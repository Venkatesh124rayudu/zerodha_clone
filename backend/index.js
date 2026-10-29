require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const authRoutes = require("./routes/authRoutes");
const { requireAuth, requireRole } = require("./middleware/auth");

const PORT = process.env.PORT || 8080;
const URI = process.env.MONGO_DB_URL;

if (!URI || !process.env.JWT_SECRET) {
  console.error("Missing MONGO_DB_URL or JWT_SECRET in .env (see .env.example)");
  process.exit(1);
}

const app = express();

// Landing site and dashboard run on different origins; both may send the auth cookie.
const allowedOrigins = (process.env.CLIENT_URLS || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((url) => url.trim());

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ---------- Auth ----------
app.use("/auth", authRoutes);

// ---------- Trading data (logged-in users) ----------
app.get("/allHoldings", requireAuth, async (req, res, next) => {
  try {
    res.json(await HoldingsModel.find({}));
  } catch (err) {
    next(err);
  }
});

app.get("/allPositions", requireAuth, async (req, res, next) => {
  try {
    res.json(await PositionsModel.find({}));
  } catch (err) {
    next(err);
  }
});

app.post("/newOrder", requireAuth, async (req, res, next) => {
  try {
    const { name, qty, price, mode } = req.body;
    const order = await OrdersModel.create({
      user: req.user._id,
      name,
      qty: Number(qty),
      price: Number(price),
      mode,
    });
    res.status(201).json(order);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid order: check quantity and price" });
    }
    next(err);
  }
});

// Each user only sees their own orders.
app.get("/Orders", requireAuth, async (req, res, next) => {
  try {
    res.json(await OrdersModel.find({ user: req.user._id }).sort({ OrderTime: -1 }));
  } catch (err) {
    next(err);
  }
});

// ---------- Admin only (role-based access) ----------
app.get("/admin/orders", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const orders = await OrdersModel.find({})
      .populate("user", "username email")
      .sort({ OrderTime: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

app.get("/admin/users", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    res.json(await UserModel.find({}).select("-password").sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

// ---------- Errors ----------
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

mongoose
  .connect(URI)
  .then(() => {
    console.log("DB is connected");
    app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err.message);
    process.exit(1);
  });
