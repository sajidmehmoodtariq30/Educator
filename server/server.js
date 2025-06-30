import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const Port = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL], // Add your frontend URLs from environment
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

connectDB();

app.get('/', (req, res) => {
    res.send('Educational Management System API is running...');
});

// Import routes
import userRouter from './routes/UserRoutes.js';
import questionRouter from './routes/QuestionRoutes.js';

// Use routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/questions', questionRouter);

// Global error handler
app.use((err, req, res, next) => {
    // Handle multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'File too large. Maximum size allowed is 5MB.'
        });
    }

    if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: err.message
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error('Error:', err);

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});