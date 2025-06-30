import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from './ApiError.js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return null;
        
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
        
        // Only try to delete file if it exists and we're not in serverless environment
        if (typeof filePath === 'string' && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        return response;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        
        // Cleanup file if it exists
        if (typeof filePath === 'string' && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        return null;
    }
};

// For handling Buffer uploads (from memory storage in serverless)
export const uploadBufferOnCloudinary = async (buffer, filename) => {
    try {
        if (!buffer) return null;
        
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    public_id: filename || `upload_${Date.now()}`,
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary buffer upload error:', error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(buffer);
        });
    } catch (error) {
        console.error('Cloudinary buffer upload error:', error);
        return null;
    }
};


export const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
    }
};
