import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    updateUserProfile,
    updateUserAvatar
} from "../controllers/AuthController.js";
import {
    uploadPaymentSlip,
    getSubscriptionDetails,
    getMyStudents,
    getMyTeachers,
    addStudent,
    addTeacher,
    addSubadmin,
    updateStudent,
    deleteStudent
} from "../controllers/UserController.js";
import {
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
} from "../controllers/AdminController.js";
import { upload } from "../middleware/multerMiddleware.js";
import { verifyJWT, verifyAdmin, verifyPrincipalOrSubadmin } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 }
    ]),
    registerUser
);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Protected routes (require authentication)
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-profile").patch(verifyJWT, updateUserProfile);
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// User subscription routes
router.route("/upload-payment-slip").post(verifyJWT, upload.single("paymentSlip"), uploadPaymentSlip);
router.route("/subscription-details").get(verifyJWT, getSubscriptionDetails);

// Principal/Subadmin routes
router.route("/my-students").get(verifyJWT, verifyPrincipalOrSubadmin, getMyStudents);
router.route("/my-teachers").get(verifyJWT, verifyPrincipalOrSubadmin, getMyTeachers);
router.route("/add-student").post(verifyJWT, verifyPrincipalOrSubadmin, addStudent);
router.route("/add-teacher").post(verifyJWT, verifyPrincipalOrSubadmin, addTeacher);
router.route("/add-subadmin").post(verifyJWT, addSubadmin); // Only principals
router.route("/update-student/:studentId").patch(verifyJWT, verifyPrincipalOrSubadmin, updateStudent);
router.route("/delete-student/:studentId").delete(verifyJWT, verifyPrincipalOrSubadmin, deleteStudent);

// Admin only routes
router.route("/admin/pending-requests").get(verifyJWT, verifyAdmin, getPendingUserRequests);
router.route("/admin/approve-request/:userId").patch(verifyJWT, verifyAdmin, approveUserRequest);
router.route("/admin/reject-request/:userId").patch(verifyJWT, verifyAdmin, rejectUserRequest);
router.route("/admin/payment-slips").get(verifyJWT, verifyAdmin, getUsersWithPaymentSlips);
router.route("/admin/verify-payment/:userId").patch(verifyJWT, verifyAdmin, verifyPaymentSlip);
router.route("/admin/reject-payment/:userId").patch(verifyJWT, verifyAdmin, rejectPaymentSlip);
router.route("/admin/all-users").get(verifyJWT, verifyAdmin, getAllUsers);
router.route("/admin/toggle-suspension/:userId").patch(verifyJWT, verifyAdmin, toggleUserSuspension);
router.route("/admin/dashboard-stats").get(verifyJWT, verifyAdmin, getDashboardStats);
router.route("/admin/extend-subscription/:userId").patch(verifyJWT, verifyAdmin, extendUserSubscription);

export default router;