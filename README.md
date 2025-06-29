# 🎓 Educator - Comprehensive Educational Management System

A full-stack MERN application for managing educational institutions with role-based access, test management, and subscription-based services.

## 🌟 Features

### 👥 User Roles & Access Control

- **Super Admin**: Platform oversight, user approvals, payment verification
- **Principal**: Institution management, teacher/student enrollment
- **Sub-Admin**: Assists principal with same dashboard access
- **Teacher**: Test creation, student assessment
- **Student**: Test participation, result viewing

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Pending approval system for new registrations
- 15-day trial period with payment slip verification
- Subscription management (Basic, Standard, Premium)

### 📝 Test Management System

- Dynamic question bank with syllabus-based categorization
- Multiple question types (MCQ, Short Answer, Long Answer)
- Class-specific test generation (2-8: Auto-generated, 9-10: Custom schemes)
- Chapter-wise, Half-book, and Full-book test patterns
- Randomized question distribution
- Student attempt tracking to prevent duplicate questions

### 📄 PDF Generation & Branding

- Dynamic PDF generation for non-MCQ tests
- Custom branding for paid users
- Default platform branding for trial users
- Responsive test layouts

### 📊 Analytics & Reporting

- Institution performance dashboards
- Student progress tracking
- Class-wise statistics
- Individual student analytics

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - File storage
- **Multer** - File upload handling

### Frontend

- **React** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Additional Tools

- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/educator.git
   cd educator
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   Create `.env` file in server directory:

   ```env
   MONGO_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Create Super Admin**

   ```bash
   cd server
   node scripts/createSuperAdmin.js
   ```

6. **Run the application**

   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

## 📁 Project Structure

``` bash

educator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── lib/          # Utilities and API
│   │   └── App.jsx       # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── scripts/         # Database scripts
│   └── server.js        # Server entry point
└── README.md
```

## 🔗 API Endpoints

### Authentication

- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token

### User Management

- `GET /api/v1/users/current-user` - Get current user
- `PATCH /api/v1/users/update-profile` - Update profile
- `POST /api/v1/users/upload-payment-slip` - Upload payment

### Admin Operations

- `GET /api/v1/users/admin/pending-requests` - Get pending approvals
- `PATCH /api/v1/users/admin/approve-request/:id` - Approve user
- `GET /api/v1/users/admin/payment-slips` - Get payment slips
- `PATCH /api/v1/users/admin/verify-payment/:id` - Verify payment

## 🎯 Current Status

### ✅ Completed

- User authentication & authorization
- Role management system
- Trial & subscription management
- Payment slip verification
- Basic dashboard structure
- User CRUD operations

### 🚧 In Development

- Test creation system
- Question bank management
- PDF generation
- Advanced analytics

### 📋 Upcoming

- Real-time notifications
- Advanced security features
- Mobile responsiveness
- Performance optimizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

### Sajid Mehmood Tariq

- GitHub: [@sajidmehmoodtariq-30](https://github.com/sajidmehmoodtariq-30)

## 🛡️ Enhanced Security Features

### 🔒 Authentication Security

- **Rate Limiting**: Implement login attempt restrictions to prevent brute force attacks
- **CAPTCHA Integration**: Add CAPTCHA verification for user registration and critical operations
- **Security Headers**: Use helmet.js for comprehensive HTTP security headers
- **IP Whitelisting**: Restrict admin panel access to specific IP addresses
- **JWT Security**: Secure token storage with httpOnly cookies and CSRF protection
- **Input Sanitization**: Comprehensive data validation and sanitization
- **SQL Injection Prevention**: Parameterized queries and input validation
- **XSS Protection**: Content Security Policy and output encoding

### 🔐 Advanced Security Measures

```javascript
// Planned security implementations:
- Two-factor authentication (2FA)
- Session management with Redis
- API key authentication for external services
- Audit logging for sensitive operations
- Password complexity requirements
- Account lockout policies
- Secure file upload validation
- Database encryption at rest
```

## 🎨 Better User Experience

### 🌟 Real-time Features

- **Socket.io Integration**: Real-time notifications for test submissions, approvals, and system updates
- **Live Chat Support**: Instant communication between users and administrators
- **Real-time Analytics**: Live dashboard updates without page refresh
- **Collaborative Features**: Multiple users can work simultaneously

### 📱 Progressive Web App (PWA)

- **Offline Capability**: Core functionality available without internet connection
- **Push Notifications**: Browser notifications for important updates
- **App-like Experience**: Native app feel on mobile devices
- **Service Worker**: Background sync and caching strategies
- **Install Prompt**: Add to home screen functionality

### 🎯 Enhanced UI/UX

- **Dark/Light Theme Toggle**: User preference-based theme switching
- **Responsive Design**: Optimized for all device sizes
- **Loading States**: Skeleton screens and progress indicators
- **Error Boundaries**: Graceful error handling and recovery
- **Accessibility**: WCAG 2.1 compliant design
- **Internationalization**: Multi-language support
- **Keyboard Navigation**: Full keyboard accessibility
- **Voice Commands**: Voice-activated navigation (future feature)

```javascript
// UX Enhancement Features:
- Smart search with autocomplete
- Drag and drop interfaces
- Context menus and shortcuts
- Breadcrumb navigation
- Infinite scroll pagination
- Advanced filtering and sorting
- Customizable dashboard layouts
- Quick action buttons
```

## ⚡ Performance Optimizations

### 🚀 Backend Performance

- **Redis Session Management**: Fast session storage and retrieval
- **Database Query Optimization**: Indexed queries and aggregation pipelines
- **Caching Strategies**: Multi-level caching with Redis and in-memory caching
- **Connection Pooling**: Efficient database connection management
- **Compression**: Gzip compression for API responses
- **CDN Integration**: Static asset delivery optimization

### 🔥 Frontend Performance

- **React.memo & useMemo**: Component and computation memoization
- **Lazy Loading**: Route-based code splitting
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Image Optimization**: WebP format and responsive images
- **Virtual Scrolling**: Efficient rendering of large lists
- **Prefetching**: Predictive resource loading

```javascript
// Performance Monitoring:
- Real-time performance metrics
- Core Web Vitals tracking
- Database query performance monitoring
- API response time tracking
- Memory usage optimization
- CPU usage optimization
```

### 📊 Database Optimizations

- **Indexing Strategy**: Optimized database indexes for fast queries
- **Aggregation Pipelines**: Efficient data processing
- **Connection Pooling**: Reduced database connection overhead
- **Query Optimization**: Efficient MongoDB queries
- **Data Archiving**: Automated old data archiving
- **Backup Strategies**: Automated backup and recovery systems

## 🌟 Additional Features

### 📧 Communication System

- **Email Notifications**: Automated emails for important events
  - User registration confirmations
  - Payment reminders and confirmations
  - Test schedules and results
  - System maintenance notifications
- **SMS Integration**: Critical alerts via SMS
- **In-app Messaging**: Direct communication between users
- **Announcement System**: Broadcast messages to specific user groups

### 🔧 Management Tools

- **Bulk Operations**: Efficient mass data operations
  - Bulk student enrollment
  - Mass teacher assignment
  - Batch test scheduling
  - Group notifications
- **Export Functionality**: Data export in multiple formats
  - Excel (.xlsx) reports
  - CSV data exports
  - PDF report generation
  - JSON data dumps
- **Import System**: Bulk data import capabilities
  - Student data import from Excel
  - Question bank import
  - User data migration tools

### 💾 Data Management

- **Backup and Restore System**: Comprehensive data protection
  - Automated daily backups
  - Point-in-time recovery
  - Cloud backup integration
  - Data integrity verification
- **Audit Trail**: Complete activity logging
  - User action tracking
  - Data modification history
  - Security event logging
  - Compliance reporting

### 📈 Advanced Analytics

- **Predictive Analytics**: AI-powered insights
  - Student performance prediction
  - Dropout risk assessment
  - Optimal study path recommendations
- **Custom Reports**: Flexible reporting system
  - Drag-and-drop report builder
  - Scheduled report generation
  - Interactive data visualization
  - Export to various formats

### 🔌 Integration Capabilities

- **Third-party Integrations**: External service connections
  - Google Classroom integration
  - Microsoft Teams integration
  - Zoom meeting integration
  - Payment gateway integration
- **API Documentation**: Comprehensive API for developers
  - RESTful API endpoints
  - GraphQL support
  - Webhook notifications
  - SDK for mobile apps

### 🛠️ Administrative Tools

- **System Monitoring**: Real-time system health monitoring
  - Server performance metrics
  - Database performance tracking
  - User activity monitoring
  - Error rate tracking
- **Content Management**: Dynamic content management
  - FAQ management
  - Help documentation
  - System announcements
  - Policy updates

## 🔮 Future Roadmap

### Phase 1: Security & Performance (Months 1-2)

- [ ] Implement rate limiting and CAPTCHA
- [ ] Add helmet.js security headers
- [ ] Set up Redis for session management
- [ ] Optimize database queries
- [ ] Implement React performance optimizations

### Phase 2: User Experience (Months 3-4)

- [ ] Integrate Socket.io for real-time features
- [ ] Implement PWA capabilities
- [ ] Add dark/light theme toggle
- [ ] Enhance loading states and error handling
- [ ] Improve mobile responsiveness

### Phase 3: Advanced Features (Months 5-6)

- [ ] Email notification system
- [ ] Bulk operations functionality
- [ ] Export/Import capabilities
- [ ] Backup and restore system
- [ ] Advanced analytics dashboard

### Phase 4: Integration & AI (Months 7-8)

- [ ] Third-party service integrations
- [ ] AI-powered analytics
- [ ] Predictive modeling
- [ ] Advanced reporting system
- [ ] Mobile app development

## 🙏 Acknowledgments

- shadcn/ui for beautiful components
- Tailwind CSS for utility-first styling  
- React Hook Form for form management
