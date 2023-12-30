const jwt = require("jsonwebtoken");

const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    if (decodedToken.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required" });
    }
  });
};

module.exports = requireAdmin;
