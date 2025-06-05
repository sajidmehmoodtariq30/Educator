import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getDashboardTitle = () => {
    switch (user.role) {
      case 'admin': return 'Admin Dashboard';
      case 'principal': return 'Principal Dashboard';
      case 'subadmin': return 'Sub-Admin Dashboard';
      case 'teacher': return 'Teacher Dashboard';
      case 'student': return 'Student Dashboard';
      default: return 'Dashboard';
    }
  };

  const getWelcomeMessage = () => {
    switch (user.role) {
      case 'admin': return 'Welcome to the admin panel. Manage users and system settings.';
      case 'principal': return 'Manage your institution, add teachers and students.';
      case 'subadmin': return 'Assist in managing the institution and its operations.';
      case 'teacher': return 'Create and manage tests for your students.';
      case 'student': return 'Take tests and view your results.';
      default: return 'Welcome to your dashboard.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getDashboardTitle()}</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.fullName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                {user.accountStatus && (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.accountStatus === 'active' ? 'bg-green-100 text-green-800' :
                    user.accountStatus === 'trial' ? 'bg-yellow-100 text-yellow-800' :
                    user.accountStatus === 'pending' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.accountStatus}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {getDashboardTitle()}
              </h2>
              <p className="text-gray-600 mb-6">
                {getWelcomeMessage()}
              </p>
              
              {/* Role-specific content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {user.role === 'admin' && (
                  <>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">Pending Approvals</h3>
                      <p className="text-gray-600">Review and approve user registrations</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">Payment Verifications</h3>
                      <p className="text-gray-600">Verify uploaded payment slips</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">System Stats</h3>
                      <p className="text-gray-600">View platform statistics</p>
                    </div>
                  </>
                )}

                {(user.role === 'principal' || user.role === 'subadmin') && (
                  <>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">Manage Students</h3>
                      <p className="text-gray-600">Add, edit, and manage students</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">Manage Teachers</h3>
                      <p className="text-gray-600">Add and manage teaching staff</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">Institution Settings</h3>
                      <p className="text-gray-600">Configure institution preferences</p>
                    </div>
                  </>
                )}

                {user.role === 'teacher' && (
                  <>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">Create Test</h3>
                      <p className="text-gray-600">Create new tests for students</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">My Tests</h3>
                      <p className="text-gray-600">View and manage your tests</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">Results</h3>
                      <p className="text-gray-600">View student test results</p>
                    </div>
                  </>
                )}

                {user.role === 'student' && (
                  <>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">Available Tests</h3>
                      <p className="text-gray-600">Take available tests</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">My Results</h3>
                      <p className="text-gray-600">View your test results</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">Profile</h3>
                      <p className="text-gray-600">Update your profile information</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
