import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
    {
        // Question Content
        questionText: {
            type: String,
            required: true,
            trim: true,
        },
        questionType: {
            type: String,
            enum: ['mcq', 'short', 'long', 'true_false'],
            required: true,
        },
        
        // Academic Information
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        class: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        chapterNumber: {
            type: Number,
            required: true,
            min: 1,
        },        // MCQ Options (only for MCQ questions)
        options: [{
            text: {
                type: String,
                required: function() {
                    // Get the parent document (the main question)
                    const parentDoc = this.parent();
                    if (parentDoc && parentDoc.questionType) {
                        return parentDoc.questionType === 'mcq';
                    }
                    // Fallback: check if this is part of an MCQ question based on the existence of multiple options
                    return false;
                }
            },
            isCorrect: {
                type: Boolean,
                default: false
            }}],
        
        // Creation & Management
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        
        // Status & Visibility
        isActive: {
            type: Boolean,
            default: true,
        },
        
        // Usage Statistics
        timesUsed: {
            type: Number,
            default: 0
        },
        correctAttempts: {
            type: Number,
            default: 0
        },
        totalAttempts: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// Indexes for better query performance
questionSchema.index({ subject: 1, class: 1, chapterNumber: 1 });
questionSchema.index({ questionType: 1 });
questionSchema.index({ createdBy: 1, createdAt: -1 });
questionSchema.index({ isActive: 1 });

// Text search index
questionSchema.index({
    questionText: 'text'
});

// Validation middleware
questionSchema.pre('save', function(next) {
    // Validate MCQ questions have correct options
    if (this.questionType === 'mcq') {
        if (!this.options || this.options.length !== 4) {
            return next(new Error('MCQ questions must have exactly 4 options'));
        }
        
        // Check if all options have text
        const emptyOptions = this.options.filter(option => !option.text || !option.text.trim());
        if (emptyOptions.length > 0) {
            return next(new Error('All 4 options must be filled for MCQ questions'));
        }
        
        const correctOptions = this.options.filter(option => option.isCorrect);
        if (correctOptions.length !== 1) {
            return next(new Error('MCQ questions must have exactly one correct option'));
        }
    }
    
    // For True/False questions, ensure we have exactly 2 options with correct values
    if (this.questionType === 'true_false') {
        if (!this.options || this.options.length !== 2) {
            return next(new Error('True/False questions must have exactly 2 options'));
        }
        
        // Check that options are exactly "True" and "False"
        const optionTexts = this.options.map(option => option.text.trim().toLowerCase());
        if (!optionTexts.includes('true') || !optionTexts.includes('false')) {
            return next(new Error('True/False questions must have exactly "True" and "False" options'));
        }
        
        const correctOptions = this.options.filter(option => option.isCorrect);
        if (correctOptions.length !== 1) {
            return next(new Error('True/False questions must have exactly one correct option'));
        }
    }
    
    next();
});

// Instance methods
questionSchema.methods.incrementUsage = function() {
    this.timesUsed += 1;
    return this.save();
};

// Static methods
questionSchema.statics.getRandomQuestions = async function(filters, count) {
    const pipeline = [
        { $match: { ...filters, isActive: true } },
        { $sample: { size: count } }
    ];
    
    return this.aggregate(pipeline);
};

// Virtual for getting question statistics
questionSchema.virtual('statistics').get(function() {
    return {
        timesUsed: this.timesUsed,
        correctAttempts: this.correctAttempts,
        totalAttempts: this.totalAttempts,
        successRate: this.totalAttempts > 0 ? (this.correctAttempts / this.totalAttempts) * 100 : 0
    };
});

// Ensure virtual fields are serialized
questionSchema.set('toJSON', { virtuals: true });

export const Question = mongoose.model("Question", questionSchema);
