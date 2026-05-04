import { generateCookieAndSetToken } from "../utils/generateCookieAndSetToken.js";
import { generateInitials } from "../utils/generateInitials.js";
import {
  errorHandler,
  serverError,
  successHandler,
} from "../utils/responseHandler.js";
import { User } from "../models/user.model.js";

import bcrypt from "bcryptjs";

export const getMe = async (req, res) => {
  const token = req.cookies?.token;
  return successHandler(res, 200, "User fetched successfully", req.user, token);
};

export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Normalize input
    const cleanFullname = fullname?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    // Validation
    if (!cleanFullname) {
      return errorHandler(res, 400, "Fullname is required.");
    }
    if (cleanFullname.length < 3) {
      return errorHandler(
        res,
        400,
        "Fullname must be at least 3 characters long.",
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!cleanEmail) {
      return errorHandler(res, 400, "Email is required.");
    }
    if (!emailRegex.test(cleanEmail)) {
      return errorHandler(res, 400, "Invalid email format.");
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!password) {
      return errorHandler(res, 400, "Password is required.");
    }
    if (!passwordRegex.test(password)) {
      return errorHandler(
        res,
        400,
        "Password must be at least 6 characters, include 1 uppercase letter and 1 number.",
      );
    }

    // Check existing user
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return errorHandler(res, 409, "User already exists with this email.");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullname: cleanFullname,
      email: cleanEmail,
      password: hashedPassword,
      lastLogin: new Date(),
      profile_initials: generateInitials(cleanFullname),
    });

    // Generate token
    const token = generateCookieAndSetToken(res, user._id);

    successHandler(res, 201, "User registered successfully.", user, token);
  } catch (error) {
    console.error(`Error in Signup Controller: ${error}`);
    return serverError(res, 500, "Internal Server Error.");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Normalize
    const cleanEmail = email?.trim().toLowerCase();

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!cleanEmail) {
      return errorHandler(res, 400, "Email is required.");
    }
    if (!emailRegex.test(cleanEmail)) {
      return errorHandler(res, 400, "Invalid email format.");
    }

    // Password validation
    if (!password) {
      return errorHandler(res, 400, "Password is required.");
    }

    // Find user
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return errorHandler(res, 401, "Invalid email or password.");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorHandler(res, 401, "Invalid email or password.");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateCookieAndSetToken(res, user._id);

    return successHandler(
      res,
      200,
      "User logged in successfully.",
      user,
      token,
    );
  } catch (error) {
    console.error(`Error in Login Controller: ${error.message}`);
    return serverError(res, 500, "Internal Server Error.");
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      expires: new Date(0),
    });

    return successHandler(
      res,
      200,
      "User logged out successfully.",
      null,
      null,
    );
  } catch (error) {
    console.error(`Error in Logout Controller: ${error.message}`);
    return serverError(res, 500, "Internal Server Error.");
  }
};
