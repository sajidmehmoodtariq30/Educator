import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";
import dotenv from "dotenv";
dotenv.config();

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized - No token provided");
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const loggedInUser = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!loggedInUser) {
            throw new ApiError(401, "Invalid access token");
        }

        // Check if user can access system
        if (!loggedInUser.canAccessSystem()) {
            let message = "Access denied.";
            
            if (loggedInUser.accountStatus === "pending") {
                message = "Your account is pending approval.";
            } else if (loggedInUser.accountStatus === "rejected") {
                message = "Your account has been rejected.";
            } else if (loggedInUser.accountStatus === "expired") {
                message = "Your subscription has expired.";
            } else if (loggedInUser.accountStatus === "suspended") {
                message = "Your account has been suspended.";
            } else if (loggedInUser.isTrialExpired()) {
                message = "Your trial period has expired.";
            }
            
            throw new ApiError(403, message);
        }

        req.user = loggedInUser;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized");
    }
});

// Middleware to verify admin role
export const verifyAdmin = asyncHandler(async (req, res, next) => {
    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin role required.");
    }
    next();
});

// Middleware to verify principal or subadmin role
export const verifyPrincipalOrSubadmin = asyncHandler(async (req, res, next) => {
    if (!["principal", "subadmin"].includes(req.user?.role)) {
        throw new ApiError(403, "Access denied. Principal or Subadmin role required.");
    }
    next();
});

// Middleware to verify teacher role
export const verifyTeacher = asyncHandler(async (req, res, next) => {
    if (req.user?.role !== "teacher") {
        throw new ApiError(403, "Access denied. Teacher role required.");
    }
    next();
});

// Middleware to verify student role
export const verifyStudent = asyncHandler(async (req, res, next) => {
    if (req.user?.role !== "student") {
        throw new ApiError(403, "Access denied. Student role required.");
    }
    next();
});

// Middleware to verify principal, subadmin, or teacher roles
export const verifyEducator = asyncHandler(async (req, res, next) => {
    if (!["principal", "subadmin", "teacher"].includes(req.user?.role)) {
        throw new ApiError(403, "Access denied. Educator role required.");
    }
    next();
});