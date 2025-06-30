import mongoose, { Schema } from "mongoose";
import pkg from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new Schema(
    {        // Core User Information
        role: {
            type: String,
            enum: ["admin", "principal", "subadmin", "teacher", "student"],
            default: "principal", // Default role for signup is principal
        },
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String, // Cloudinary URL
            default: "",
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
          // Account Status & Access Control
        accountStatus: {
            type: String,
            enum: ["pending", "trial", "active", "expired", "suspended", "rejected"],
            default: "pending",
        },
        
        // Trial & Payment System
        trialStartDate: {
            type: Date,
        },
        trialEndDate: {
            type: Date,
        },
        
        // Payment Information
        subscriptionPlan: {
            type: String,
            enum: ["basic", "standard", "premium"],
            default: "basic",
        },
        subscriptionStartDate: {
            type: Date,
        },
        subscriptionEndDate: {
            type: Date,
        },
        paymentSlipUrl: {
            type: String, // Cloudinary URL for uploaded payment slip
        },
        paymentSlipUploadDate: {
            type: Date,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending",
        },
        paymentVerificationDate: {
            type: Date,
        },
        paymentRejectionReason: {
            type: String,
            trim: true,
        },
        paymentVerifiedBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the admin who verified/rejected payment
        },
        
        // Access Request System
        accessRequestDate: {
            type: Date,
            default: Date.now,
        },
        accessApprovalDate: {
            type: Date,
        },
        accessRejectionReason: {
            type: String,
            trim: true,
        },
        accessApprovedBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the admin who approved/rejected
        },
        
        // Principal-specific fields
        institutionName: {
            type: String,
            trim: true,
        },
        maxStudentsAllowed: {
            type: Number,
            default: 0,
        },
        currentStudentCount: {
            type: Number,
            default: 0,
        },
          // Hierarchical relationships
        principalId: {
            type: Schema.Types.ObjectId,
            ref: "User", // For subadmins, teachers, and students
        },
          // Student-specific fields
        studentId: {
            type: String,
            trim: true,
            sparse: true, // Only for students
        },
        class: {
            type: String,
            trim: true,
        },
        section: {
            type: String,
            trim: true,
        },
        rollNumber: {
            type: String,
            trim: true,
        },
          // Teacher-specific fields
        teacherId: {
            type: String,
            trim: true,
            sparse: true, // Only for teachers
        },
        subject: {
            type: [String], // Array of subjects teacher can handle
            default: [],
        },
        classesAssigned: [{
            class: { type: String },
            section: { type: String }
        }],
        
        // Authentication & Security
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
        
        // Email Verification
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationToken: {
            type: String
        },
        emailVerificationExpires: {
            type: Date
        },
        
        // Password Reset
        passwordResetToken: {
            type: String
        },
        passwordResetExpires: {
            type: Date
        },
        
        // Activity Tracking
        lastLoginAt: {
            type: Date
        },
        lastActiveAt: {
            type: Date,
            default: Date.now
        },
        
        // Account Status
        isActive: {
            type: Boolean,
            default: true
        },
        isSuspended: {
            type: Boolean,
            default: false
        },
        suspensionReason: {
            type: String,
            trim: true
        },
        suspensionExpires: {
            type: Date
        },
        
        // Notifications & Preferences
        preferences: {
            emailNotifications: {
                type: Boolean,
                default: true
            },
            testReminders: {
                type: Boolean,
                default: true
            },
            resultNotifications: {
                type: Boolean,
                default: true
            }
        },
        
        // Test-related tracking (for students)
        testStats: {
            totalTestsAttempted: {
                type: Number,
                default: 0
            },
            totalTestsCompleted: {
                type: Number,
                default: 0
            },
            averageScore: {
                type: Number,
                default: 0
            },
            totalTimeSpent: {
                type: Number,
                default: 0 // in minutes
            }
        },
        
        
    },
    { timestamps: true }
);

// Add indexes for performance
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ username: 1, isActive: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ accountStatus: 1 });
userSchema.index({ principalId: 1 });
userSchema.index({ class: 1, section: 1 });
userSchema.index({ subscriptionEndDate: 1 });
userSchema.index({ trialEndDate: 1 });
userSchema.index({ paymentStatus: 1 });
userSchema.index({ lastActiveAt: -1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });

// Pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Instance methods
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return pkg.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName,
            role: this.role,
            accountStatus: this.accountStatus,
            principalId: this.principalId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return pkg.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

// Method to check if user's subscription is active
userSchema.methods.isSubscriptionActive = function () {
    if (this.accountStatus === "trial") {
        return this.trialEndDate && new Date() <= this.trialEndDate;
    }
    if (this.accountStatus === "active") {
        return this.subscriptionEndDate && new Date() <= this.subscriptionEndDate;
    }
    return false;
};

// Method to check if trial period is over
userSchema.methods.isTrialExpired = function () {
    return this.trialEndDate && new Date() > this.trialEndDate;
};

// Method to start trial period
userSchema.methods.startTrial = function () {
    const trialDays = 15;
    this.trialStartDate = new Date();
    this.trialEndDate = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000);
    this.accountStatus = "trial";
};

// Method to activate subscription
userSchema.methods.activateSubscription = function (durationInMonths = 12) {
    this.subscriptionStartDate = new Date();
    this.subscriptionEndDate = new Date();
    this.subscriptionEndDate.setMonth(this.subscriptionEndDate.getMonth() + durationInMonths);
    this.accountStatus = "active";
    this.paymentStatus = "verified";
};

// Method to check if user can access system
userSchema.methods.canAccessSystem = function () {
    if (this.accountStatus === "suspended" || !this.isActive) {
        return false;
    }
    if (this.accountStatus === "trial") {
        return !this.isTrialExpired();
    }
    if (this.accountStatus === "active") {
        return this.isSubscriptionActive();
    }
    return false;
};

// Method to get remaining days
userSchema.methods.getRemainingDays = function () {
    let endDate;
    if (this.accountStatus === "trial") {
        endDate = this.trialEndDate;
    } else if (this.accountStatus === "active") {
        endDate = this.subscriptionEndDate;
    } else {
        return 0;
    }
    
    if (!endDate) return 0;
    
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
};

export const User = mongoose.model("User", userSchema);