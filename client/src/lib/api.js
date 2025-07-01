// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Import auth utilities
import authUtils from './auth.js';

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok) {
        // If unauthorized and we have a refresh token, try to refresh
        if (response.status === 401 && data.message?.includes('token')) {
            try {
                const refreshResponse = await fetch(`${API_BASE_URL}/users/refresh-token`, {
                    method: 'POST',
                    credentials: 'include',
                });
                
                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    if (refreshData.data && refreshData.data.accessToken) {
                        authUtils.setToken(refreshData.data.accessToken);
                        // You might want to retry the original request here
                    }
                }
            } catch (refreshError) {
                // If refresh fails, clear the token and redirect to login
                authUtils.removeToken();
                console.error('Token refresh failed:', refreshError);
            }
        }
        
        throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from auth utilities
    const token = authUtils.getToken();
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        credentials: 'include', // Include cookies for authentication
        ...options,
    };

    // If there's a body and it's not FormData, stringify it
    if (options.body && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body);
    } else if (options.body instanceof FormData) {
        // Remove Content-Type header for FormData (browser will set it with boundary)
        delete config.headers['Content-Type'];
    }

    const response = await fetch(url, config);
    return handleResponse(response);
};

// Authentication API functions
export const authAPI = {
    // Register a new principal
    register: async (userData) => {
        const formData = new FormData();
        
        // Append all fields to FormData
        Object.keys(userData).forEach(key => {
            if (key === 'avatar' && userData[key] && userData[key].length > 0) {
                formData.append('avatar', userData[key][0]);
            } else if (key !== 'avatar' && key !== 'confirmPassword') {
                formData.append(key, userData[key]);
            }
        });

        return apiRequest('/users/register', {
            method: 'POST',
            body: formData,
        });
    },

    // Login user
    login: async (credentials) => {
        const response = await apiRequest('/users/login', {
            method: 'POST',
            body: credentials,
        });
        
        // Store token using auth utilities
        if (response.data && response.data.accessToken) {
            authUtils.setToken(response.data.accessToken);
        }
        
        return response;
    },

    // Logout user
    logout: async () => {
        const response = await apiRequest('/users/logout', {
            method: 'POST',
        });
        
        // Clear token using auth utilities
        authUtils.removeToken();
        
        return response;
    },

    // Get current user
    getCurrentUser: async () => {
        return apiRequest('/users/current-user');
    },

    // Refresh access token
    refreshToken: async () => {
        return apiRequest('/users/refresh-token', {
            method: 'POST',
        });
    },

    // Change password
    changePassword: async (passwordData) => {
        return apiRequest('/users/change-password', {
            method: 'POST',
            body: passwordData,
        });
    },

    // Update profile
    updateProfile: async (profileData) => {
        return apiRequest('/users/update-profile', {
            method: 'PATCH',
            body: profileData,
        });
    },

    // Update avatar
    updateAvatar: async (avatarFile) => {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        return apiRequest('/users/update-avatar', {
            method: 'PATCH',
            body: formData,
        });
    },

    // Upload payment slip
    uploadPaymentSlip: async (paymentSlipFile) => {
        const formData = new FormData();
        formData.append('paymentSlip', paymentSlipFile);

        return apiRequest('/users/upload-payment-slip', {
            method: 'POST',
            body: formData,
        });
    },

    // Get subscription details
    getSubscriptionDetails: async () => {
        return apiRequest('/users/subscription-details');
    },
};

// Principal/Subadmin API functions
export const principalAPI = {
    // Get students
    getStudents: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/users/my-students${queryString ? `?${queryString}` : ''}`);
    },

    // Get teachers
    getTeachers: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/users/my-teachers${queryString ? `?${queryString}` : ''}`);
    },

    // Add student
    addStudent: async (studentData) => {
        return apiRequest('/users/add-student', {
            method: 'POST',
            body: studentData,
        });
    },

    // Add teacher
    addTeacher: async (teacherData) => {
        return apiRequest('/users/add-teacher', {
            method: 'POST',
            body: teacherData,
        });
    },

    // Add subadmin
    addSubadmin: async (subadminData) => {
        return apiRequest('/users/add-subadmin', {
            method: 'POST',
            body: subadminData,
        });
    },

    // Update student
    updateStudent: async (studentId, studentData) => {
        return apiRequest(`/users/update-student/${studentId}`, {
            method: 'PATCH',
            body: studentData,
        });
    },

    // Delete student
    deleteStudent: async (studentId) => {
        return apiRequest(`/users/delete-student/${studentId}`, {
            method: 'DELETE',
        });
    },
};

// Admin API functions
export const adminAPI = {
    // Get pending requests
    getPendingRequests: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/users/admin/pending-requests${queryString ? `?${queryString}` : ''}`);
    },

    // Approve user request
    approveRequest: async (userId, approvalData) => {
        return apiRequest(`/users/admin/approve-request/${userId}`, {
            method: 'PATCH',
            body: approvalData,
        });
    },

    // Reject user request
    rejectRequest: async (userId, rejectionData) => {
        return apiRequest(`/users/admin/reject-request/${userId}`, {
            method: 'PATCH',
            body: rejectionData,
        });
    },

    // Get users with payment slips
    getPaymentSlips: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/users/admin/payment-slips${queryString ? `?${queryString}` : ''}`);
    },

    // Verify payment
    verifyPayment: async (userId, verificationData) => {
        return apiRequest(`/users/admin/verify-payment/${userId}`, {
            method: 'PATCH',
            body: verificationData,
        });
    },

    // Reject payment
    rejectPayment: async (userId, rejectionData) => {
        return apiRequest(`/users/admin/reject-payment/${userId}`, {
            method: 'PATCH',
            body: rejectionData,
        });
    },

    // Get all users
    getAllUsers: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/users/admin/all-users${queryString ? `?${queryString}` : ''}`);
    },

    // Toggle user suspension
    toggleSuspension: async (userId, suspensionData) => {
        return apiRequest(`/users/admin/toggle-suspension/${userId}`, {
            method: 'PATCH',
            body: suspensionData,
        });
    },

    // Get dashboard stats
    getDashboardStats: async () => {
        return apiRequest('/users/admin/dashboard-stats');
    },    // Extend subscription
    extendSubscription: async (userId, extensionData) => {
        return apiRequest(`/users/admin/extend-subscription/${userId}`, {
            method: 'PATCH',
            body: extensionData,
        });
    },
};

// Question Management API functions
export const questionAPI = {
    // Get all questions with filters
    getQuestions: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/questions${queryString ? `?${queryString}` : ''}`);
    },    // Create a new question
    createQuestion: async (questionData) => {
        // For simplified version, send JSON data instead of FormData
        const processedData = {
            ...questionData,
            options: questionData.options,
            tags: questionData.tags
        };

        return apiRequest('/questions', {
            method: 'POST',
            body: processedData,
        });
    },

    // Get question by ID
    getQuestionById: async (questionId) => {
        return apiRequest(`/questions/${questionId}`);
    },    // Update question
    updateQuestion: async (questionId, questionData) => {
        // For simplified version, send JSON data instead of FormData
        const processedData = {
            ...questionData,
            options: questionData.options,
            tags: questionData.tags
        };

        return apiRequest(`/questions/${questionId}`, {
            method: 'PATCH',
            body: processedData,
        });
    },

    // Delete question (soft delete)
    deleteQuestion: async (questionId) => {
        return apiRequest(`/questions/${questionId}`, {
            method: 'DELETE',
        });
    },

    // Permanently delete question
    permanentDeleteQuestion: async (questionId) => {
        return apiRequest(`/questions/${questionId}/permanent`, {
            method: 'DELETE',
        });
    },

    // Bulk create questions
    bulkCreateQuestions: async (questionsArray) => {
        return apiRequest('/questions/bulk', {
            method: 'POST',
            body: { questions: questionsArray },
        });
    },

    // Get questions for test generation
    getQuestionsForTest: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/questions/for-test${queryString ? `?${queryString}` : ''}`);
    },

    // Get question statistics
    getQuestionStats: async () => {
        return apiRequest('/questions/stats');
    },

    // Get filter options
    getFilterOptions: async () => {
        return apiRequest('/questions/filter-options');
    },
};

// School Management API functions
export const schoolAPI = {
    // Get all schools
    getAllSchools: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/users/admin/schools${queryString ? `?${queryString}` : ''}`);
    },

    // Get school by ID
    getSchoolById: async (schoolId) => {
        return apiRequest(`/users/admin/schools/${schoolId}`);
    },

    // Update school settings
    updateSchoolSettings: async (schoolId, schoolData) => {
        return apiRequest(`/users/admin/schools/${schoolId}`, {
            method: 'PUT',
            body: schoolData,
        });
    },
};

export default { authAPI, principalAPI, adminAPI, questionAPI, schoolAPI };
