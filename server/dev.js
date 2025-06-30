import app from './server.js';

const Port = process.env.PORT || 3000;

app.listen(Port, () => {
    console.log(`🚀 Server is running on port ${Port}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Health check: http://localhost:${Port}/health`);
    console.log(`📊 API base: http://localhost:${Port}/api/v1`);
});
