import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Use memory storage for serverless environments (Vercel)
// Use disk storage for local development
const isProduction = process.env.NODE_ENV === 'production';

let storage;

if (isProduction) {
    // Memory storage for production/serverless
    storage = multer.memoryStorage();
} else {
    // Disk storage for local development
    const uploadDir = './public/temp';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            // Generate unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });
}

// File filter for images only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

export const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});