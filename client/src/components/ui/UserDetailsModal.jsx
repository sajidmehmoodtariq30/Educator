import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  School, 
  GraduationCap, 
  UserCheck, 
  Users, 
  Crown,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  X,
  FileText,
  Star,
  Globe
} from 'lucide-react';

const UserDetailsModal = ({ user, isOpen, onClose, onApprove, onReject, onSuspend }) => {
  if (!isOpen || !user) return null;

  const getRoleIcon = (role) => {
    const icons = {
      admin: Crown,
      principal: School,
      subadmin: UserCheck,
      teacher: GraduationCap,
      student: User
    };
    const Icon = icons[role] || User;
    return <Icon className="w-6 h-6" />;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'text-purple-600 bg-purple-100',
      principal: 'text-blue-600 bg-blue-100',
      subadmin: 'text-green-600 bg-green-100',
      teacher: 'text-orange-600 bg-orange-100',
      student: 'text-indigo-600 bg-indigo-100'
    };
    return colors[role] || 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      trial: 'text-blue-600 bg-blue-100 border-blue-200',
      active: 'text-green-600 bg-green-100 border-green-200',
      expired: 'text-red-600 bg-red-100 border-red-200',
      suspended: 'text-gray-600 bg-gray-100 border-gray-200',
      rejected: 'text-red-600 bg-red-100 border-red-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'trial': return <Star className="w-4 h-4" />;
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      case 'suspended': return <Shield className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                user.role === 'admin' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                user.role === 'principal' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                user.role === 'subadmin' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                user.role === 'teacher' ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                'bg-gradient-to-r from-indigo-500 to-purple-500'
              } shadow-lg`}>
                {getRoleIcon(user.role)}
                <div className="text-white">{getRoleIcon(user.role)}</div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {user.role.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-lg border ${getStatusColor(user.accountStatus)} flex items-center gap-1`}>
                    {getStatusIcon(user.accountStatus)}
                    {user.accountStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-full w-10 h-10 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{user.username}</span>
                  </div>
                </div>
                {user.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{user.phone}</span>
                    </div>
                  </div>
                )}
                {user.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{user.address}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Role-specific Information */}
          {user.role === 'principal' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <School className="w-5 h-5" />
                  <span>Institution Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.institutionName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Institution Name</label>
                    <p className="text-gray-900 mt-1">{user.institutionName}</p>
                  </div>
                )}
                {user.maxStudentsAllowed && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Max Students Allowed</label>
                    <p className="text-gray-900 mt-1">{user.maxStudentsAllowed}</p>
                  </div>
                )}
                {user.currentStudentCount !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Student Count</label>
                    <p className="text-gray-900 mt-1">{user.currentStudentCount}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {user.role === 'student' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Academic Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {user.class && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Class</label>
                      <p className="text-gray-900 mt-1">{user.class}</p>
                    </div>
                  )}
                  {user.section && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Section</label>
                      <p className="text-gray-900 mt-1">{user.section}</p>
                    </div>
                  )}
                  {user.rollNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Roll Number</label>
                      <p className="text-gray-900 mt-1">{user.rollNumber}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {user.role === 'teacher' && user.subject && user.subject.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Teaching Subjects</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.subject.map((subj, index) => (
                    <span key={index} className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
                      {subj}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Created</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                {user.accessApprovalDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Approved Date</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{new Date(user.accessApprovalDate).toLocaleString()}</span>
                    </div>
                  </div>
                )}
                {user.lastLoginAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Login</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{new Date(user.lastLoginAt).toLocaleString()}</span>
                    </div>
                  </div>
                )}
                {user.subscriptionPlan && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Subscription Plan</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 capitalize">{user.subscriptionPlan}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-2xl p-6">
          <div className="flex flex-wrap gap-3 justify-end">
            {user.accountStatus === 'pending' && (
              <>
                <Button 
                  onClick={() => {
                    onApprove?.(user);
                    onClose();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve User
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    onReject?.(user);
                    onClose();
                  }}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject User
                </Button>
              </>
            )}
            
            {['trial', 'active'].includes(user.accountStatus) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  onSuspend?.(user);
                  onClose();
                }}
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <Shield className="w-4 h-4 mr-2" />
                {user.accountStatus === 'suspended' ? 'Unsuspend' : 'Suspend'} User
              </Button>
            )}
            
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
