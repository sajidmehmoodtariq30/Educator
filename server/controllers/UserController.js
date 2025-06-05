import { User } from "../models/UserModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Upload payment slip
const uploadPaymentSlip = asyncHandler(async (req, res) => {
    const paymentSlipLocalPath = req.file?.path;

    if (!paymentSlipLocalPath) {
        throw new ApiError(400, "Payment slip file is required");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if user is in trial or expired status
    if (user.accountStatus !== "trial" && user.accountStatus !== "expired") {
        throw new ApiError(400, "Payment slip can only be uploaded during trial or after expiration");
    }

    // Upload to cloudinary
    const paymentSlip = await uploadOnCloudinary(paymentSlipLocalPath);

    if (!paymentSlip.url) {
        throw new ApiError(400, "Error while uploading payment slip");
    }

    // Update user with payment slip info
    user.paymentSlipUrl = paymentSlip.url;
    user.paymentSlipUploadDate = new Date();
    user.paymentStatus = "pending";

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Payment slip uploaded successfully. Waiting for admin verification.")
    );
});

// Get user's subscription details
const getSubscriptionDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");

    const subscriptionDetails = {
        accountStatus: user.accountStatus,
        subscriptionPlan: user.subscriptionPlan,
        remainingDays: user.getRemainingDays(),
        canAccess: user.canAccessSystem(),
        trialStartDate: user.trialStartDate,
        trialEndDate: user.trialEndDate,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionEndDate: user.subscriptionEndDate,
        paymentStatus: user.paymentStatus,
        paymentSlipUrl: user.paymentSlipUrl,
        paymentSlipUploadDate: user.paymentSlipUploadDate,
        paymentVerificationDate: user.paymentVerificationDate,
        paymentRejectionReason: user.paymentRejectionReason
    };

    return res.status(200).json(
        new ApiResponse(200, subscriptionDetails, "Subscription details fetched successfully")
    );
});

// Get students under a principal (for principal dashboard)
const getMyStudents = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, class: userClass, section, search } = req.query;

    // Check if user is principal or subadmin
    if (!["principal", "subadmin"].includes(req.user.role)) {
        throw new ApiError(403, "Only principals and subadmins can access this endpoint");
    }

    const principalId = req.user.role === "principal" ? req.user._id : req.user.principalId;

    const query = { 
        role: "student",
        principalId: principalId
    };

    if (userClass) query.class = userClass;
    if (section) query.section = section;
    
    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { studentId: { $regex: search, $options: "i" } },
            { rollNumber: { $regex: search, $options: "i" } }
        ];
    }

    const students = await User.find(query)
        .select("-password -refreshToken")
        .sort({ class: 1, section: 1, rollNumber: 1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            students,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            }
        }, "Students fetched successfully")
    );
});

// Get teachers under a principal (for principal dashboard)
const getMyTeachers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;

    // Check if user is principal or subadmin
    if (!["principal", "subadmin"].includes(req.user.role)) {
        throw new ApiError(403, "Only principals and subadmins can access this endpoint");
    }

    const principalId = req.user.role === "principal" ? req.user._id : req.user.principalId;

    const query = { 
        role: "teacher",
        principalId: principalId
    };
    
    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { teacherId: { $regex: search, $options: "i" } },
            { subject: { $in: [new RegExp(search, "i")] } }
        ];
    }

    const teachers = await User.find(query)
        .select("-password -refreshToken")
        .sort({ fullName: 1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            teachers,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            }
        }, "Teachers fetched successfully")
    );
});

// Add a new student (for principal)
const addStudent = asyncHandler(async (req, res) => {
    const {
        username,
        email,
        fullName,
        password,
        phone,
        address,
        studentId,
        class: userClass,
        section,
        rollNumber
    } = req.body;

    // Check if user is principal or subadmin
    if (!["principal", "subadmin"].includes(req.user.role)) {
        throw new ApiError(403, "Only principals and subadmins can add students");
    }

    const principalId = req.user.role === "principal" ? req.user._id : req.user.principalId;
    const principal = await User.findById(principalId);

    // Check student limit
    if (principal.currentStudentCount >= principal.maxStudentsAllowed) {
        throw new ApiError(400, "Maximum student limit reached for this principal");
    }

    // Validation
    if ([fullName, email, username, password, studentId, userClass, section].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All required fields must be filled");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }, { studentId }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with email, username, or student ID already exists");
    }

    // Create student
    const student = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        role: "student",
        phone: phone || "",
        address: address || "",
        studentId,
        class: userClass,
        section,
        rollNumber,
        principalId,
        accountStatus: "active", // Students added by principal are automatically active
        subscriptionStartDate: principal.subscriptionStartDate,
        subscriptionEndDate: principal.subscriptionEndDate
    });

    // Update principal's student count
    principal.currentStudentCount += 1;
    await principal.save();

    const createdStudent = await User.findById(student._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, createdStudent, "Student added successfully")
    );
});

// Add a new teacher (for principal)
const addTeacher = asyncHandler(async (req, res) => {
    const {
        username,
        email,
        fullName,
        password,
        phone,
        address,
        teacherId,
        subject,
        classesAssigned
    } = req.body;

    // Check if user is principal or subadmin
    if (!["principal", "subadmin"].includes(req.user.role)) {
        throw new ApiError(403, "Only principals and subadmins can add teachers");
    }

    const principalId = req.user.role === "principal" ? req.user._id : req.user.principalId;
    const principal = await User.findById(principalId);

    // Validation
    if ([fullName, email, username, password, teacherId].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All required fields must be filled");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }, { teacherId }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with email, username, or teacher ID already exists");
    }

    // Create teacher
    const teacher = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        role: "teacher",
        phone: phone || "",
        address: address || "",
        teacherId,
        subject: Array.isArray(subject) ? subject : [subject],
        classesAssigned: classesAssigned || [],
        principalId,
        accountStatus: "active", // Teachers added by principal are automatically active
        subscriptionStartDate: principal.subscriptionStartDate,
        subscriptionEndDate: principal.subscriptionEndDate
    });

    const createdTeacher = await User.findById(teacher._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, createdTeacher, "Teacher added successfully")
    );
});

// Add a new subadmin (for principal)
const addSubadmin = asyncHandler(async (req, res) => {
    const {
        username,
        email,
        fullName,
        password,
        phone,
        address
    } = req.body;

    // Only principals can add subadmins
    if (req.user.role !== "principal") {
        throw new ApiError(403, "Only principals can add subadmins");
    }

    // Validation
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All required fields must be filled");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Create subadmin
    const subadmin = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        role: "subadmin",
        phone: phone || "",
        address: address || "",
        principalId: req.user._id,
        accountStatus: "active", // Subadmins added by principal are automatically active
        subscriptionStartDate: req.user.subscriptionStartDate,
        subscriptionEndDate: req.user.subscriptionEndDate
    });

    const createdSubadmin = await User.findById(subadmin._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, createdSubadmin, "Subadmin added successfully")
    );
});

// Update student details (for principal)
const updateStudent = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const {
        fullName,
        phone,
        address,
        class: userClass,
        section,
        rollNumber
    } = req.body;

    // Check if user is principal or subadmin
    if (!["principal", "subadmin"].includes(req.user.role)) {
        throw new ApiError(403, "Only principals and subadmins can update students");
    }

    const principalId = req.user.role === "principal" ? req.user._id : req.user.principalId;

    const student = await User.findOne({
        _id: studentId,
        role: "student",
        principalId: principalId
    });

    if (!student) {
        throw new ApiError(404, "Student not found or not under your management");
    }

    // Update student
    const updatedStudent = await User.findByIdAndUpdate(
        studentId,
        {
            $set: {
                fullName: fullName || student.fullName,
                phone: phone || student.phone,
                address: address || student.address,
                class: userClass || student.class,
                section: section || student.section,
                rollNumber: rollNumber || student.rollNumber
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, updatedStudent, "Student updated successfully")
    );
});

// Delete student (for principal)
const deleteStudent = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    // Check if user is principal or subadmin
    if (!["principal", "subadmin"].includes(req.user.role)) {
        throw new ApiError(403, "Only principals and subadmins can delete students");
    }

    const principalId = req.user.role === "principal" ? req.user._id : req.user.principalId;

    const student = await User.findOne({
        _id: studentId,
        role: "student",
        principalId: principalId
    });

    if (!student) {
        throw new ApiError(404, "Student not found or not under your management");
    }

    await User.findByIdAndDelete(studentId);

    // Update principal's student count
    const principal = await User.findById(principalId);
    principal.currentStudentCount = Math.max(0, principal.currentStudentCount - 1);
    await principal.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Student deleted successfully")
    );
});

export {
    uploadPaymentSlip,
    getSubscriptionDetails,
    getMyStudents,
    getMyTeachers,
    addStudent,
    addTeacher,
    addSubadmin,
    updateStudent,
    deleteStudent
};
