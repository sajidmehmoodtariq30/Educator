import mongoose, { Schema } from "mongoose";

const schoolSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
            default: "India",
        },
        postalCode: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        website: {
            type: String,
            trim: true,
        },
        
        // Principal/Owner Information
        principalId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        
        // School Configuration
        schoolType: {
            type: String,
            enum: ["primary", "secondary", "higher_secondary", "college", "university", "coaching_center", "other"],
            default: "secondary",
        },
        boards: [{
            type: String,
            enum: ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"],
        }],
        
        // Classes offered
        classesOffered: [{
            class: { type: String },
            sections: [{ type: String }],
        }],
        
        // Subscription & Limits
        subscriptionPlan: {
            type: String,
            enum: ["basic", "standard", "premium"],
            default: "basic",
        },
        maxStudentsAllowed: {
            type: Number,
            default: 100,
        },
        maxTeachersAllowed: {
            type: Number,
            default: 10,
        },
        maxSubAdminsAllowed: {
            type: Number,
            default: 3,
        },
        
        // Current Counts
        currentStudentCount: {
            type: Number,
            default: 0,
        },
        currentTeacherCount: {
            type: Number,
            default: 0,
        },
        currentSubAdminCount: {
            type: Number,
            default: 0,
        },
        
        // Status
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        
        // License & Verification
        licenseNumber: {
            type: String,
            trim: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationDate: {
            type: Date,
        },
        verificationDocuments: [{
            type: String, // Cloudinary URLs
        }],
        
        // Settings & Preferences
        settings: {
            allowOnlineTests: {
                type: Boolean,
                default: true,
            },
            allowOfflineTests: {
                type: Boolean,
                default: true,
            },
            testTimeLimit: {
                type: Number,
                default: 120, // minutes
            },
            allowResultDownload: {
                type: Boolean,
                default: true,
            },
            enableNotifications: {
                type: Boolean,
                default: true,
            },
            academicYearStart: {
                type: Date,
                default: () => new Date(new Date().getFullYear(), 3, 1), // April 1st
            },
            academicYearEnd: {
                type: Date,
                default: () => new Date(new Date().getFullYear() + 1, 2, 31), // March 31st
            },
        },
        
        // Branding
        logo: {
            type: String, // Cloudinary URL
        },
        colors: {
            primary: {
                type: String,
                default: "#3b82f6",
            },
            secondary: {
                type: String,
                default: "#64748b",
            },
        },
        
        // Statistics
        stats: {
            totalTestsConducted: {
                type: Number,
                default: 0,
            },
            totalQuestionsCreated: {
                type: Number,
                default: 0,
            },
            totalStudentsEnrolled: {
                type: Number,
                default: 0,
            },
        },
        
        // Admin approval tracking
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        approvedAt: {
            type: Date,
        },
        
    },
    { timestamps: true }
);

// Add indexes for performance
schoolSchema.index({ principalId: 1 });
schoolSchema.index({ status: 1, isActive: 1 });
schoolSchema.index({ name: 1 });
schoolSchema.index({ city: 1, state: 1 });
schoolSchema.index({ subscriptionPlan: 1 });

// Method to check if school can add more students
schoolSchema.methods.canAddStudents = function(count = 1) {
    return (this.currentStudentCount + count) <= this.maxStudentsAllowed;
};

// Method to check if school can add more teachers
schoolSchema.methods.canAddTeachers = function(count = 1) {
    return (this.currentTeacherCount + count) <= this.maxTeachersAllowed;
};

// Method to check if school can add more sub-admins
schoolSchema.methods.canAddSubAdmins = function(count = 1) {
    return (this.currentSubAdminCount + count) <= this.maxSubAdminsAllowed;
};

// Method to update counts
schoolSchema.methods.updateCounts = async function() {
    const User = mongoose.model("User");
    
    this.currentStudentCount = await User.countDocuments({ 
        principalId: this.principalId, 
        role: "student",
        isActive: true 
    });
    
    this.currentTeacherCount = await User.countDocuments({ 
        principalId: this.principalId, 
        role: "teacher",
        isActive: true 
    });
    
    this.currentSubAdminCount = await User.countDocuments({ 
        principalId: this.principalId, 
        role: "subadmin",
        isActive: true 
    });
    
    await this.save();
};

export const School = mongoose.model("School", schoolSchema);
