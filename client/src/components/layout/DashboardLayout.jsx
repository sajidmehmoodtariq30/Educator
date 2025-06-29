import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { authAPI } from '@/lib/api';

const DashboardLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to login even if logout API fails
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  const getDashboardTitle = () => {
    switch (user?.role) {
      case 'admin': return 'Admin Dashboard';
      case 'principal': return 'Principal Dashboard';
      case 'subadmin': return 'Sub-Admin Dashboard';
      case 'teacher': return 'Teacher Dashboard';
      case 'student': return 'Student Dashboard';
      default: return 'Dashboard';
    }
  };

  const getNavigationLinks = () => {
    if (!user) return [];

    const baseLinks = [
      { path: `/${user.role}/dashboard`, label: 'Overview', exact: true }
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...baseLinks,
          { path: '/admin/questions', label: 'Questions' },
          { path: '/admin/users', label: 'Users' },
          { path: '/admin/payments', label: 'Payments' }
        ];
      case 'principal':
        return [
          ...baseLinks,
          { path: '/principal/students', label: 'Students' },
          { path: '/principal/teachers', label: 'Teachers' },
          { path: '/principal/reports', label: 'Reports' }
        ];
      case 'teacher':
        return [
          ...baseLinks,
          { path: '/teacher/tests', label: 'My Tests' },
          { path: '/teacher/create-test', label: 'Create Test' },
          { path: '/teacher/results', label: 'Results' }
        ];
      case 'student':
        return [
          ...baseLinks,
          { path: '/student/tests', label: 'Tests' },
          { path: '/student/results', label: 'Results' },
          { path: '/student/profile', label: 'Profile' }
        ];
      default:
        return baseLinks;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 animate-reverse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading Dashboard...</p>
            <p className="text-gray-500">Please wait while we prepare your experience</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigationLinks = getNavigationLinks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {getDashboardTitle()}
                </h1>
                <p className="text-gray-600 mt-1 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Welcome back, {user.fullName}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow-md border border-white/20">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{user.email}</p>
                  <div className="flex items-center justify-end space-x-2 mt-1">
                    <p className="text-xs text-gray-500 capitalize font-medium">{user.role}</p>
                    {user.accountStatus && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${
                        user.accountStatus === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        user.accountStatus === 'trial' ? 'bg-amber-100 text-amber-800' :
                        user.accountStatus === 'pending' ? 'bg-slate-100 text-slate-700' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.accountStatus}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {navigationLinks.length > 1 && (
        <nav className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 overflow-x-auto">
              {navigationLinks.map((link) => {
                const isActive = link.exact 
                  ? location.pathname === link.path
                  : location.pathname.startsWith(link.path);
                
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`relative py-4 px-6 font-medium text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50/80 rounded-t-xl'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/40 rounded-t-xl'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
