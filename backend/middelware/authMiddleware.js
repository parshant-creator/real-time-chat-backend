const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel")
const authMiddleware = async (
  req,
  res,
  next
) => {

  try {

    let token =
      req.headers.authorization;

    if (!token) {

      return res.status(401).json({
        success: false,
        message: "No token provided",
      });

    }

    if (
      token.startsWith("Bearer ")
    ) {

      token = token.split(" ")[1];

    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
const user = await userModel.findById(
  decoded.id
);

if (!user) {
  return res.status(401).json({
    success: false,
    message: "User no longer exists",
  });
}
    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
      error: error.message,
    });

  }

};

module.exports = authMiddleware;