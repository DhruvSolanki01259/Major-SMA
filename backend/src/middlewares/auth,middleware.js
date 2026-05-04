import { errorHandler, serverError } from "../utils/responseHandler.js";
import { User } from "../models/user.model.js";

import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return errorHandler(res, 401, "Unauthorized - No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return errorHandler(res, 401, "Unauthorized - Invalid token");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return errorHandler(res, 401, "Unauthorized - User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return serverError(res, 401, "Unauthorized - Token failed");
  }
};
