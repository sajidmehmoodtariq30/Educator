import { User } from "../models/UserModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get all pending user requests for superadmin dashboard
const getPendingUserRequests = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, role } = req.query;

    const query = { accountStatus: "pending" };
    if (role) {
        query.role = role;
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        select: "-password -refreshToken"
    };

    const pendingUsers = await User.find(query)
        .select("-password -refreshToken")
        .populate("principalId", "fullName institutionName")
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            users: pendingUsers,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            }
        }, "Pending user requests fetched successfully")
    );
});

// Approve user request and start trial
const approveUserRequest = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { maxStudentsAllowed, subscriptionPlan = "basic" } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.accountStatus !== "pending") {
        throw new ApiError(400, "User request is not in pending status");
    }

    // Start trial period
    user.startTrial();
    user.accessApprovedBy = req.user._id;
    user.accessApprovalDate = new Date();
    user.subscriptionPlan = subscriptionPlan;

    // Set max students for principals
    if (user.role === "principal" && maxStudentsAllowed) {
        user.maxStudentsAllowed = parseInt(maxStudentsAllowed);
    }

    await user.save();

    const updatedUser = await User.findById(userId)
        .select("-password -refreshToken")
        .populate("accessApprovedBy", "fullName");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User request approved successfully. Trial period started.")
    );
});

// Reject user request
const rejectUserRequest = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
        throw new ApiError(400, "Rejection reason is required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.accountStatus !== "pending") {
        throw new ApiError(400, "User request is not in pending status");
    }

    user.accountStatus = "rejected";
    user.accessRejectionReason = rejectionReason;
    user.accessApprovedBy = req.user._id;
    user.accessApprovalDate = new Date();

    await user.save();

    const updatedUser = await User.findById(userId)
        .select("-password -refreshToken")
        .populate("accessApprovedBy", "fullName");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User request rejected successfully")
    );
});

// Get all users with payment slips waiting for verification
const getUsersWithPaymentSlips = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const query = { 
        paymentSlipUrl: { $exists: true, $ne: "" },
        paymentStatus: "pending"
    };

    const users = await User.find(query)
        .select("-password -refreshToken")
        .populate("principalId", "fullName institutionName")
        .sort({ paymentSlipUploadDate: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            users,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            }
        }, "Users with payment slips fetched successfully")
    );
});

// Verify payment slip and activate subscription
const verifyPaymentSlip = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { subscriptionDurationMonths = 12 } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.paymentSlipUrl) {
        throw new ApiError(400, "No payment slip found for this user");
    }

    if (user.paymentStatus !== "pending") {
        throw new ApiError(400, "Payment is not in pending status");
    }

    // Activate subscription
    user.activateSubscription(parseInt(subscriptionDurationMonths));
    user.paymentVerifiedBy = req.user._id;
    user.paymentVerificationDate = new Date();

    await user.save();

    const updatedUser = await User.findById(userId)
        .select("-password -refreshToken")
        .populate("paymentVerifiedBy", "fullName");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Payment verified and subscription activated successfully")
    );
});

// Reject payment slip
const rejectPaymentSlip = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
        throw new ApiError(400, "Rejection reason is required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.paymentSlipUrl) {
        throw new ApiError(400, "No payment slip found for this user");
    }

    user.paymentStatus = "rejected";
    user.paymentRejectionReason = rejectionReason;
    user.paymentVerifiedBy = req.user._id;
    user.paymentVerificationDate = new Date();

    await user.save();

    const updatedUser = await User.findById(userId)
        .select("-password -refreshToken")
        .populate("paymentVerifiedBy", "fullName");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Payment slip rejected successfully")
    );
});

// Get all users (for admin dashboard)
const getAllUsers = asyncHandler(async (req, res) => {
    const { 
        page = 1, 
        limit = 10, 
        role, 
        accountStatus, 
        search,
        principalId 
    } = req.query;

    const query = {};

    if (role) query.role = role;
    if (accountStatus) query.accountStatus = accountStatus;
    if (principalId) query.principalId = principalId;
    
    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } }
        ];
    }

    const users = await User.find(query)
        .select("-password -refreshToken")
        .populate("principalId", "fullName institutionName")
        .populate("accessApprovedBy", "fullName")
        .populate("paymentVerifiedBy", "fullName")
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            users,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            }
        }, "Users fetched successfully")
    );
});

// Suspend/Unsuspend user
const toggleUserSuspension = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { suspensionReason, suspensionDurationDays } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isSuspended) {
        // Unsuspend user
        user.isSuspended = false;
        user.suspensionReason = "";
        user.suspensionExpires = null;
    } else {
        // Suspend user
        if (!suspensionReason) {
            throw new ApiError(400, "Suspension reason is required");
        }

        user.isSuspended = true;
        user.suspensionReason = suspensionReason;
        
        if (suspensionDurationDays) {
            const suspensionExpires = new Date();
            suspensionExpires.setDate(suspensionExpires.getDate() + parseInt(suspensionDurationDays));
            user.suspensionExpires = suspensionExpires;
        }
    }

    await user.save();

    const updatedUser = await User.findById(userId).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, `User ${user.isSuspended ? 'suspended' : 'unsuspended'} successfully`)
    );
});

// Get dashboard statistics
const getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await Promise.all([
        User.countDocuments({ accountStatus: "pending" }),
        User.countDocuments({ accountStatus: "trial" }),
        User.countDocuments({ accountStatus: "active" }),
        User.countDocuments({ accountStatus: "expired" }),
        User.countDocuments({ role: "principal" }),
        User.countDocuments({ role: "teacher" }),
        User.countDocuments({ role: "student" }),
        User.countDocuments({ 
            paymentSlipUrl: { $exists: true, $ne: "" },
            paymentStatus: "pending"
        }),
        User.countDocuments({ 
            trialEndDate: { 
                $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
            },
            accountStatus: "trial"
        }), // Trials expiring in 7 days
        User.countDocuments({ 
            subscriptionEndDate: { 
                $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
            },
            accountStatus: "active"
        }) // Subscriptions expiring in 30 days
    ]);

    const dashboardStats = {
        pendingRequests: stats[0],
        trialUsers: stats[1],
        activeUsers: stats[2],
        expiredUsers: stats[3],
        totalPrincipals: stats[4],
        totalTeachers: stats[5],
        totalStudents: stats[6],
        pendingPayments: stats[7],
        trialsExpiringSoon: stats[8],
        subscriptionsExpiringSoon: stats[9],
        totalUsers: stats[1] + stats[2] + stats[3]
    };

    return res.status(200).json(
        new ApiResponse(200, dashboardStats, "Dashboard statistics fetched successfully")
    );
});

// Extend user subscription
const extendUserSubscription = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { extensionMonths = 1 } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.accountStatus !== "active" && user.accountStatus !== "expired") {
        throw new ApiError(400, "Can only extend subscription for active or expired users");
    }

    // Extend subscription
    const currentEndDate = user.subscriptionEndDate || new Date();
    const newEndDate = new Date(currentEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + parseInt(extensionMonths));
    
    user.subscriptionEndDate = newEndDate;
    if (user.accountStatus === "expired") {
        user.accountStatus = "active";
    }

    await user.save();

    const updatedUser = await User.findById(userId).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, `Subscription extended by ${extensionMonths} month(s) successfully`)
    );
});

export {
    getPendingUserRequests,
    approveUserRequest,
    rejectUserRequest,
    getUsersWithPaymentSlips,
    verifyPaymentSlip,
    rejectPaymentSlip,
    getAllUsers,
    toggleUserSuspension,
    getDashboardStats,
    extendUserSubscription
};
