import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("User token:", token);
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
      next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token payload:", decoded);
    // Attach auth info safely without assuming req.body exists
    req.user = decoded;
    req.userId = decoded.id;
    // Some handlers expect userId in req.body; ensure req.body exists first
    if (!req.body) req.body = {};
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    // Token errors should return 401; other errors are 500
    console.error("Error authenticating user:", error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' || error.code === 'EAUTH') {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default userAuth;
