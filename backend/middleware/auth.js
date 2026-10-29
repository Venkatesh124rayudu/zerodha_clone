const jwt = require("jsonwebtoken");

const { UserModel } = require("../model/UserModel");

// Verifies the JWT (httpOnly cookie, or "Authorization: Bearer <token>") and attaches req.user.
const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = req.cookies?.token || (header?.startsWith("Bearer ") ? header.slice(7) : null);

  if (!token) {
    return res.status(401).json({ message: "Please log in to continue" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(payload.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Account no longer exists" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired, please log in again" });
  }
};

// Role-based access control: allow only the listed roles. Use after requireAuth.
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have permission to do this" });
  }
  next();
};

module.exports = { requireAuth, requireRole };
