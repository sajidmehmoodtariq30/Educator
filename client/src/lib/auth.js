// Authentication utility functions
export const authUtils = {
    // Get token from localStorage
    getToken: () => {
        return localStorage.getItem('accessToken');
    },
    
    // Set token in localStorage
    setToken: (token) => {
        if (token) {
            localStorage.setItem('accessToken', token);
        }
    },
    
    // Remove token from localStorage
    removeToken: () => {
        localStorage.removeItem('accessToken');
    },
    
    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('accessToken');
        return !!token;
    },
    
    // Decode JWT token to get user info (without verification)
    getTokenPayload: () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    },
    
    // Check if token is expired
    isTokenExpired: () => {
        const payload = authUtils.getTokenPayload();
        if (!payload || !payload.exp) return true;
        
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    }
};

export default authUtils;
