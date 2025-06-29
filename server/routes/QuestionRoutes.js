import { Router } from "express";
import {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    permanentDeleteQuestion,
    bulkCreateQuestions,
    getQuestionsForTest,
    getQuestionStats,
    getFilterOptions
} from "../controllers/QuestionController.js";
import { verifyJWT, verifyAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// Apply JWT middleware to all routes
router.use(verifyJWT);

// Public routes (accessible by all authenticated users)
router.route("/filter-options").get(getFilterOptions);
router.route("/for-test").get(getQuestionsForTest);

// Admin-only routes for question management
router.route("/")
    .get(verifyAdmin, getQuestions)
    .post(verifyAdmin, createQuestion);

router.route("/bulk").post(verifyAdmin, bulkCreateQuestions);
router.route("/stats").get(verifyAdmin, getQuestionStats);

router.route("/:questionId")
    .get(verifyAdmin, getQuestionById)
    .patch(verifyAdmin, updateQuestion)
    .delete(verifyAdmin, deleteQuestion);

router.route("/:questionId/permanent").delete(verifyAdmin, permanentDeleteQuestion);

export default router;
