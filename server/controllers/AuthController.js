import { User } from "../models/UserModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

// Generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

// User Registration (Request Access) - Only for Principals
const registerUser = asyncHandler(async (req, res) => {
    console.log('Registration request received');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const {
        username,
        email,
        fullName,
        password,
        phone,
        address,
        institutionName
    } = req.body;

    // Validation
    if ([fullName, email, username, password, institutionName].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All required fields must be filled (Full Name, Email, Username, Password, Institution Name)");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Handle avatar upload
    let avatarUrl = "";
    if (req.files?.avatar?.[0]) {
        const avatarLocalPath = req.files.avatar[0].path;
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (avatar) {
            avatarUrl = avatar.url;
        }
    }

    // Create principal user object
    const userData = {
        fullName,
        avatar: avatarUrl,
        email,
        password,
        username: username.toLowerCase(),
        role: "principal", // Always principal for signup
        phone: phone || "",
        address: address || "",
        institutionName,
        maxStudentsAllowed: 0, // Will be set by admin based on plan
        accountStatus: "pending", // All registrations start as pending
    };

    // Create user
    const user = await User.create(userData);

    // Remove password and refresh token from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "Principal registration request submitted successfully. Waiting for admin approval.")
    );
});

// User Login
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Check if user can access system
    if (!user.canAccessSystem()) {
        let message = "Access denied.";

        if (user.accountStatus === "pending") {
            message = "Your account is pending approval. Please wait for admin review.";
        } else if (user.accountStatus === "rejected") {
            message = "Your account has been rejected.";
        } else if (user.accountStatus === "expired") {
            message = "Your subscription has expired. Please contact admin.";
        } else if (user.accountStatus === "suspended") {
            message = "Your account has been suspended.";
        } else if (user.isTrialExpired()) {
            message = "Your trial period has expired. Please upload payment slip to continue.";
        }

        throw new ApiError(403, message);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Update last login
    user.lastLoginAt = new Date();
    user.lastActiveAt = new Date();
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                    remainingDays: user.getRemainingDays()
                },
                "User logged in successfully"
            )
        );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, {
            user,
            remainingDays: user.getRemainingDays(),
            canAccess: user.canAccessSystem()
        }, "Current user fetched successfully"));
});

// Change Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.comparePassword(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, phone, address } = req.body;

    if (!fullName) {
        throw new ApiError(400, "Full name is required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                phone: phone || "",
                address: address || ""
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Profile updated successfully"));
});

// Update User Avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    updateUserProfile,
    updateUserAvatar
};
