# Vercel Deployment Guide

## Changes Made for Vercel Compatibility

1. **Unified server structure**: Single `server.js` that works for both local and serverless
2. **Updated `vercel.json`** for proper routing
3. **Smart database connection** handling for both environments
4. **Updated multer middleware** to use memory storage in production
5. **Enhanced Cloudinary utilities** for buffer uploads

## Environment Variables Required

Make sure to set these environment variables in your Vercel dashboard:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
```

## Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy

## Local Development

For local development, you can still use:

```bash
npm run dev
```

This will use the traditional Express server setup.

## Key Features

- **Seamless environment handling**: Same codebase works on localhost and Vercel
- **Smart database connections**: Managed per request to avoid connection issues
- **File uploads**: Uses memory storage for serverless, disk storage for local
- **Health check endpoint**: `/health` for debugging deployment issues
- **Error handling**: Improved for serverless environment
