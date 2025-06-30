import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Database connection state management
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }
    
    try {
        await connectDB();
        isConnected = true;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware to ensure database connection for each request
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error('Database connection middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'Educational Management System API is running...',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        mongodb_uri_configured: !!process.env.MONGO_URI,
        jwt_secret_configured: !!process.env.JWT_SECRET,
        cloudinary_configured: !!process.env.CLOUDINARY_CLOUD_NAME
    });
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

// For local development
const Port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(Port, () => {
        console.log(`Server is running on port ${Port}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

export default app;