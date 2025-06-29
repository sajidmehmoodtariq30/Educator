import { Question } from "../models/QuestionModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a new question
const createQuestion = asyncHandler(async (req, res) => {
    const { questionText, questionType, subject, class: className, chapterNumber, options } = req.body;

    // Validate required fields
    if (!questionText || !questionType || !subject || !className || !chapterNumber) {
        throw new ApiError(400, "All required fields must be provided");
    }

    // Validate MCQ options
    if (questionType === 'mcq' || questionType === 'true_false') {
        if (!options || !Array.isArray(options) || options.length < 2) {
            throw new ApiError(400, "MCQ questions must have at least 2 options");
        }

        const correctOptions = options.filter(option => option.isCorrect);
        if (correctOptions.length !== 1) {
            throw new ApiError(400, "Exactly one option must be marked as correct");
        }
    }    // Create question
    const question = await Question.create({
        questionText,
        questionType,
        subject,
        class: className,
        chapterNumber,
        options: (questionType === 'mcq' || questionType === 'true_false') ? options : [],
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, question, "Question created successfully")
    );
});

// Get all questions with filters and pagination
const getQuestions = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        subject,
        class: className,
        chapterNumber,
        questionType,
        search,
        isActive,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    const query = {};    // Apply filters
    if (subject) query.subject = subject;
    if (className) query.class = parseInt(className);
    if (chapterNumber) query.chapterNumber = parseInt(chapterNumber);
    if (questionType) query.questionType = questionType;
    if (isActive !== undefined) query.isActive = isActive === 'true';    // Search functionality
    if (search) {
        query.$or = [
            { questionText: { $regex: search, $options: "i" } },
            { subject: { $regex: search, $options: "i" } }
        ];
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const questions = await Question.find(query)
        .populate("createdBy", "fullName")
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Question.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            questions,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total,
                hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
                hasPrev: parseInt(page) > 1
            }
        }, "Questions fetched successfully")
    );
});

// Get question by ID
const getQuestionById = asyncHandler(async (req, res) => {
    const { questionId } = req.params;

    const question = await Question.findById(questionId)
        .populate("createdBy", "fullName");

    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    return res.status(200).json(
        new ApiResponse(200, question, "Question fetched successfully")
    );
});

// Update question
const updateQuestion = asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    const updateData = req.body;

    const question = await Question.findById(questionId);

    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    // Update fields individually to ensure proper validation context
    Object.keys(updateData).forEach(key => {
        question[key] = updateData[key];
    });

    // Save the question to trigger validation
    await question.save();

    // Populate and return the updated question
    const updatedQuestion = await Question.findById(questionId)
        .populate("createdBy", "fullName");

    return res.status(200).json(
        new ApiResponse(200, updatedQuestion, "Question updated successfully")
    );
});

// Delete question (soft delete)
const deleteQuestion = asyncHandler(async (req, res) => {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);

    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    // Soft delete by setting isActive to false
    question.isActive = false;
    await question.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Question deleted successfully")
    );
});

// Permanently delete question
const permanentDeleteQuestion = asyncHandler(async (req, res) => {
    const { questionId } = req.params;

    const question = await Question.findByIdAndDelete(questionId);

    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Question permanently deleted")
    );
});

// Bulk create questions
const bulkCreateQuestions = asyncHandler(async (req, res) => {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        throw new ApiError(400, "Questions array is required");
    }

    // Add metadata to each question
    const questionsWithMetadata = questions.map(question => ({
        ...question,
        createdBy: req.user._id,
        isActive: true
    }));

    const createdQuestions = await Question.insertMany(questionsWithMetadata, {
        ordered: false // Continue on errors
    });

    return res.status(201).json(
        new ApiResponse(201, {
            created: createdQuestions.length,
            questions: createdQuestions
        }, "Questions created successfully")
    );
});

// Get questions for test generation
const getQuestionsForTest = asyncHandler(async (req, res) => {
    const {
        subject,
        class: className,
        chapters,
        questionType,
        count = 10,
        excludeQuestions = []
    } = req.query;

    const query = {
        subject,
        class: parseInt(className),
        isActive: true
    };    if (chapters) {
        query.chapterNumber = { $in: chapters.split(',').map(ch => parseInt(ch)) };
    }

    if (questionType) {
        query.questionType = { $in: questionType.split(',') };
    }

    if (excludeQuestions.length > 0) {
        query._id = { $nin: excludeQuestions };
    }

    const questions = await Question.getRandomQuestions(query, parseInt(count));

    return res.status(200).json(
        new ApiResponse(200, questions, "Questions for test fetched successfully")
    );
});

// Get question statistics
const getQuestionStats = asyncHandler(async (req, res) => {
    const stats = await Question.aggregate([
        {
            $group: {
                _id: null,
                totalQuestions: { $sum: 1 },
                activeQuestions: {
                    $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
                }
            }
        }
    ]);

    // Get subject distribution
    const subjectStats = await Question.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: { subject: "$subject", class: "$class" },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: "$_id.subject",
                classes: {
                    $push: {
                        class: "$_id.class",
                        count: "$count"
                    }
                },
                totalCount: { $sum: "$count" }
            }
        }
    ]);

    // Get class distribution for the class selector
    const classStats = await Question.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: "$class",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 } // Sort by class number
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            overview: stats[0] || { totalQuestions: 0, activeQuestions: 0 },
            subjectDistribution: subjectStats,
            classDistribution: classStats.map(item => ({
                class: item._id,
                totalQuestions: item.count, // Changed from 'count' to 'totalQuestions'
                activeQuestions: item.count, // Also add activeQuestions for consistency
                count: item.count // Keep original for backward compatibility
            }))
        }, "Question statistics fetched successfully")
    );
});

// Get unique values for filters
const getFilterOptions = asyncHandler(async (req, res) => {
    // Predefined subjects for classes 2-8
    const predefinedSubjects = ['English', 'Urdu', 'Math', 'Science'];
    
    // Get unique subjects from database (in case there are custom ones)
    const [dbSubjects, chapterNumbers] = await Promise.all([
        Question.distinct("subject"),
        Question.distinct("chapterNumber")
    ]);
    
    // Combine and deduplicate subjects
    const allSubjects = [...new Set([...predefinedSubjects, ...dbSubjects])];

    const classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const questionTypes = ['mcq', 'short', 'long', 'true_false'];

    return res.status(200).json(
        new ApiResponse(200, {
            subjects: allSubjects,
            classes,
            chapterNumbers: chapterNumbers.sort((a, b) => a - b), // Sort chapter numbers
            questionTypes
        }, "Filter options fetched successfully")
    );
});

export {
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
};
