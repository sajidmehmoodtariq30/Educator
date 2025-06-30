import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserCard from '@/components/ui/UserCard';
import SearchBar from '@/components/ui/SearchBar';
import SchoolCard from '@/components/ui/SchoolCardNew';
import UserDetailsModal from '@/components/ui/UserDetailsModal';
import AddUserModal from '@/components/ui/AddUserModal';
import { adminAPI } from '@/lib/api';
import { 
  Users, 
  School, 
  UserCheck, 
  GraduationCap, 
  User,
  Crown,
  Filter,
  Grid,
  List,
  ArrowLeft,
  Plus,
  Download,
  Upload,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react';

const AdminUserManagement = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get initial view from URL params
  const initialView = searchParams.get('view') || 'overview';
  
  const [view, setView] = useState(initialView); // 'overview', 'schools', 'users', 'pending', 'all-users'
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    loadDashboardStats();
    if (view === 'overview') {
      loadSchools();
    }
  }, []);

  useEffect(() => {
    if (view === 'users' || view === 'pending' || view === 'all-users') {
      loadUsers();
    }
  }, [view, searchTerm, filters, selectedSchool]);

  const loadDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      let apiCall;
      const params = {
        search: searchTerm,
        ...filters,
        limit: 50
      };

      // If a school is selected, filter by principalId
      if (selectedSchool && view === 'users') {
        params.principalId = selectedSchool.principalId;
      }

      if (view === 'pending') {
        apiCall = adminAPI.getPendingRequests(params);
      } else {
        apiCall = adminAPI.getAllUsers(params);
      }

      const response = await apiCall;
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchools = async () => {
    setLoading(true);
    try {
      // Get all principals and group by institution
      const response = await adminAPI.getAllUsers({ role: 'principal' });
      const principals = response.data.users || [];
      
      // Group users by institution to create school data
      const schoolMap = new Map();
      
      for (const principal of principals) {
        if (principal.institutionName) {
          if (!schoolMap.has(principal.institutionName)) {
            schoolMap.set(principal.institutionName, {
              institutionName: principal.institutionName,
              principalName: principal.fullName,
              principalId: principal._id,
              principalStatus: principal.accountStatus,
              location: principal.address,
              createdAt: principal.createdAt,
              userCounts: { subadmin: 0, teacher: 0, student: 0 },
              activeCounts: { subadmin: 0, teacher: 0, student: 0 },
              subscriptionInfo: {
                plan: principal.subscriptionPlan,
                expiryDate: principal.subscriptionEndDate
              }
            });
          }
        }
      }

      // Now get counts for each school
      const allUsersResponse = await adminAPI.getAllUsers({ limit: 1000 });
      const allUsers = allUsersResponse.data.users || [];

      allUsers.forEach(user => {
        if (user.principalId) {
          // Find the principal to get institution name
          const principal = principals.find(p => p._id === user.principalId);
          if (principal && principal.institutionName) {
            const school = schoolMap.get(principal.institutionName);
            if (school && ['subadmin', 'teacher', 'student'].includes(user.role)) {
              school.userCounts[user.role]++;
              if (['active', 'trial'].includes(user.accountStatus)) {
                school.activeCounts[user.role]++;
              }
            }
          }
        }
      });

      setSchools(Array.from(schoolMap.values()));
    } catch (error) {
      console.error('Failed to load schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (user) => {
    try {
      const approvalData = {};
      if (user.role === 'principal') {
        approvalData.maxStudentsAllowed = 100; // Default value
      }
      
      await adminAPI.approveRequest(user._id, approvalData);
      loadUsers();
      loadDashboardStats();
      alert('User approved successfully!');
    } catch (error) {
      alert('Failed to approve user: ' + error.message);
    }
  };

  const handleRejectUser = async (user) => {
    const reason = prompt('Please provide a rejection reason:');
    if (!reason) return;

    try {
      await adminAPI.rejectRequest(user._id, { rejectionReason: reason });
      loadUsers();
      loadDashboardStats();
      alert('User rejected successfully!');
    } catch (error) {
      alert('Failed to reject user: ' + error.message);
    }
  };

  const handleSuspendUser = async (user) => {
    try {
      const action = user.accountStatus === 'suspended' ? 'unsuspend' : 'suspend';
      const reason = action === 'suspend' ? prompt('Please provide a suspension reason:') : '';
      
      if (action === 'suspend' && !reason) return;

      await adminAPI.toggleSuspension(user._id, { 
        action,
        reason: reason || 'Unsuspended by admin'
      });
      
      loadUsers();
      alert(`User ${action}ed successfully!`);
    } catch (error) {
      alert(`Failed to ${action} user: ` + error.message);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const handleCloseUserDetails = () => {
    setSelectedUser(null);
    setShowUserDetailsModal(false);
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleCloseAddUser = () => {
    setShowAddUserModal(false);
  };

  const getQuickStats = () => {
    if (!stats) return [];
    
    return [
      {
        title: 'Total Users',
        value: stats.totalUsers || 0,
        icon: Users,
        color: 'bg-blue-500',
        change: stats.userGrowth || 0
      },
      {
        title: 'Pending Requests',
        value: stats.pendingRequests || 0,
        icon: Clock,
        color: 'bg-yellow-500',
        change: 0
      },
      {
        title: 'Active Schools',
        value: stats.activeSchools || 0,
        icon: School,
        color: 'bg-green-500',
        change: stats.schoolGrowth || 0
      },
      {
        title: 'Suspended Users',
        value: stats.suspendedUsers || 0,
        icon: Shield,
        color: 'bg-red-500',
        change: 0
      }
    ];
  };

  // Overview View
  if (view === 'overview') {
    const quickStats = getQuickStats();
    
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-xl animate-glow">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-2 animate-fadeIn">
                  User Management Hub
                </h1>
                <p className="text-xl opacity-90 animate-slideUp">
                  Manage all users, schools, and access permissions
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={stat.title} className="group hover:shadow-lg transition-all duration-300 animate-scaleIn" style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    {stat.change !== 0 && (
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+{stat.change}%</span>
                      </div>
                    )}
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Action Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-4"></span>
            Management Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Schools Management */}
            <Card 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden animate-scaleIn"
              onClick={() => setView('schools')}
            >
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <CardContent className="p-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <School className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Schools & Institutions</h3>
                    <p className="text-gray-600 mb-4">View and manage all educational institutions</p>
                    <div className="text-2xl font-bold text-blue-600">{schools.length}</div>
                    <div className="text-sm text-gray-500">Active Schools</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <Card 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden animate-scaleIn"
              style={{animationDelay: '0.1s'}}
              onClick={() => setView('pending')}
            >
              <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
              <CardContent className="p-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Pending Requests</h3>
                    <p className="text-gray-600 mb-4">Approve or reject new user requests</p>
                    <div className="text-2xl font-bold text-yellow-600">{stats?.pendingRequests || 0}</div>
                    <div className="text-sm text-gray-500">Awaiting Approval</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Users */}
            <Card 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden animate-scaleIn"
              style={{animationDelay: '0.2s'}}
              onClick={() => setView('all-users')}
            >
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <CardContent className="p-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">All Users</h3>
                    <p className="text-gray-600 mb-4">Comprehensive user management and CRUD operations</p>
                    <div className="text-2xl font-bold text-green-600">{stats?.totalUsers || 0}</div>
                    <div className="text-sm text-gray-500">Total Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="animate-scaleIn" style={{animationDelay: '0.3s'}}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would be populated with real activity data */}
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New principal request approved</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">3 new teacher accounts created</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment verification pending</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Details Modal */}
        <UserDetailsModal
          user={selectedUser}
          isOpen={showUserDetailsModal}
          onClose={handleCloseUserDetails}
          onApprove={handleApproveUser}
          onReject={handleRejectUser}
          onSuspend={handleSuspendUser}
        />

        {/* Add User Modal */}
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={handleCloseAddUser}
          onUserAdded={() => {
            loadUsers();
            loadDashboardStats();
            setShowAddUserModal(false);
          }}
        />
      </div>
    );
  }

  // Schools View
  if (view === 'schools') {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setView('overview')}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Overview
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                    <School className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Schools & Institutions</h1>
                    <p className="text-lg opacity-90">{schools.length} Active Schools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchBar
          onSearch={setSearchTerm}
          onFilterChange={setFilters}
          placeholder="Search schools by name or location..."
        />

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
          ) : schools.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <School className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Schools Found</h3>
              <p className="text-gray-500">No educational institutions match your search criteria.</p>
            </div>
          ) : (
            schools
              .filter(school => 
                !searchTerm || 
                school.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                school.principalName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((school, index) => (
                <div key={school.principalId} className="cursor-pointer" onClick={() => {
                  setSelectedSchool(school);
                  setView('users');
                }}>
                  <SchoolCard
                    school={{
                      ...school,
                      name: school.institutionName,
                      principalId: { fullName: school.principalName },
                      currentStudentCount: school.userCounts?.student || 0,
                      currentTeacherCount: school.userCounts?.teacher || 0,
                      currentSubAdminCount: school.userCounts?.subadmin || 0,
                      maxStudentsAllowed: school.maxStudentsAllowed || 100,
                      maxTeachersAllowed: school.maxTeachersAllowed || 10,
                      maxSubAdminsAllowed: school.maxSubAdminsAllowed || 3,
                      status: school.principalStatus || 'active',
                      subscriptionPlan: 'basic',
                      createdAt: new Date().toISOString()
                    }}
                    compact={true}
                  />
                </div>
              ))
          )}
        </div>

        {/* User Details Modal */}
        <UserDetailsModal
          user={selectedUser}
          isOpen={showUserDetailsModal}
          onClose={handleCloseUserDetails}
          onApprove={handleApproveUser}
          onReject={handleRejectUser}
          onSuspend={handleSuspendUser}
        />

        {/* Add User Modal */}
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={handleCloseAddUser}
          onUserAdded={() => {
            loadUsers();
            loadDashboardStats();
            setShowAddUserModal(false);
          }}
        />
      </div>
    );
  }

  // Pending Requests View
  if (view === 'pending') {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setView('overview')}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Overview
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Pending Requests</h1>
                    <p className="text-lg opacity-90">{users.length} Awaiting Approval</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchBar
          onSearch={setSearchTerm}
          onFilterChange={setFilters}
          placeholder="Search pending requests..."
        />

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
          </div
          >
          
          <div className="text-sm text-gray-600">
            {users.length} pending request{users.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Users List/Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
          ) : users.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <CheckCircle className="w-24 h-24 text-green-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Requests</h3>
              <p className="text-gray-500">All user requests have been processed.</p>
            </div>
          ) : (
            users.map((user, index) => (
              <UserCard
                key={user._id}
                user={user}
                onApprove={handleApproveUser}
                onReject={handleRejectUser}
                onViewDetails={handleViewDetails}
                compact={viewMode === 'list'}
              />
            ))
          )}
        </div>

        {/* User Details Modal */}
        <UserDetailsModal
          user={selectedUser}
          isOpen={showUserDetailsModal}
          onClose={handleCloseUserDetails}
          onApprove={handleApproveUser}
          onReject={handleRejectUser}
          onSuspend={handleSuspendUser}
        />

        {/* Add User Modal */}
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={handleCloseAddUser}
          onUserAdded={() => {
            loadUsers();
            loadDashboardStats();
            setShowAddUserModal(false);
          }}
        />
      </div>
    );
  }

  // All Users View
  if (view === 'all-users' || view === 'users') {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => {
                    if (selectedSchool) {
                      setSelectedSchool(null);
                      setView('schools');
                    } else {
                      setView('overview');
                    }
                  }}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {selectedSchool ? 'Back to Schools' : 'Back to Overview'}
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">
                      {selectedSchool ? `${selectedSchool.institutionName} Users` : 'All Users'}
                    </h1>
                    <p className="text-lg opacity-90">{users.length} Total Users</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchBar
          onSearch={setSearchTerm}
          onFilterChange={setFilters}
          placeholder={selectedSchool ? 
            `Search users in ${selectedSchool.institutionName}...` : 
            "Search all users..."
          }
        />

        {/* View Toggle and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
          </div
          >
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600">
              {users.length} user{users.length !== 1 ? 's' : ''}
            </div>
            <Button size="sm" onClick={handleAddUser}>
              <Plus className="w-4 h-4 mr-1" />
              Add User
            </Button>
          </div>
        </div>

        {/* Users List/Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
          ) : users.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Users Found</h3>
              <p className="text-gray-500">No users match your search criteria.</p>
            </div>
          ) : (
            users.map((user, index) => (
              <UserCard
                key={user._id}
                user={user}
                onApprove={handleApproveUser}
                onReject={handleRejectUser}
                onSuspend={handleSuspendUser}
                onViewDetails={handleViewDetails}
                compact={viewMode === 'list'}
              />
            ))
          )}
        </div>

        {/* User Details Modal */}
        <UserDetailsModal
          user={selectedUser}
          isOpen={showUserDetailsModal}
          onClose={handleCloseUserDetails}
          onApprove={handleApproveUser}
          onReject={handleRejectUser}
          onSuspend={handleSuspendUser}
        />

        {/* Add User Modal */}
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={handleCloseAddUser}
          onUserAdded={() => {
            loadUsers();
            loadDashboardStats();
            setShowAddUserModal(false);
          }}
        />
      </div>
    );
  }
};

export default AdminUserManagement;