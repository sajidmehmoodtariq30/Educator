import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
  Shield
} from 'lucide-react';

const UserCard = ({ 
  user, 
  onApprove, 
  onReject, 
  onSuspend, 
  onViewDetails, 
  showActions = true,
  compact = false 
}) => {
  const getRoleIcon = (role) => {
    const icons = {
      admin: Crown,
      principal: School,
      subadmin: UserCheck,
      teacher: GraduationCap,
      student: User
    };
    return icons[role] || User;
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
      pending: 'text-yellow-700 bg-yellow-100 border-yellow-200',
      trial: 'text-blue-700 bg-blue-100 border-blue-200',
      active: 'text-green-700 bg-green-100 border-green-200',
      expired: 'text-red-700 bg-red-100 border-red-200',
      suspended: 'text-gray-700 bg-gray-100 border-gray-200',
      rejected: 'text-red-700 bg-red-100 border-red-200'
    };
    return colors[status] || 'text-gray-700 bg-gray-100 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: AlertCircle,
      trial: Clock,
      active: CheckCircle,
      expired: XCircle,
      suspended: Shield,
      rejected: XCircle
    };
    const IconComponent = icons[status] || AlertCircle;
    return <IconComponent className="w-3 h-3" />;
  };

  const RoleIcon = getRoleIcon(user.role);

  if (compact) {
    return (
      <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer" onClick={onViewDetails}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <RoleIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{user.fullName}</h3>
              <p className="text-sm text-gray-600 truncate">{user.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(user.accountStatus)} flex items-center gap-1`}>
                {getStatusIcon(user.accountStatus)}
                {user.accountStatus}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${
        user.role === 'admin' ? 'from-purple-500 to-pink-500' :
        user.role === 'principal' ? 'from-blue-500 to-cyan-500' :
        user.role === 'subadmin' ? 'from-green-500 to-emerald-500' :
        user.role === 'teacher' ? 'from-orange-500 to-yellow-500' :
        'from-indigo-500 to-purple-500'
      }`}></div>
      
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              user.role === 'admin' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
              user.role === 'principal' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
              user.role === 'subadmin' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              user.role === 'teacher' ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
              'bg-gradient-to-r from-indigo-500 to-purple-500'
            } shadow-lg`}>
              <RoleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{user.fullName}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                  {user.role.toUpperCase()}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(user.accountStatus)} flex items-center gap-1`}>
                  {getStatusIcon(user.accountStatus)}
                  {user.accountStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          {user.avatar && (
            <img 
              src={user.avatar} 
              alt={user.fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{user.phone}</span>
            </div>
          )}
          {user.address && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{user.address}</span>
            </div>
          )}
        </div>

        {/* Role-specific Information */}
        {user.role === 'principal' && user.institutionName && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <School className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">{user.institutionName}</span>
            </div>
            {user.maxStudentsAllowed > 0 && (
              <div className="flex items-center space-x-2 mt-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-700">
                  {user.currentStudentCount || 0}/{user.maxStudentsAllowed} students
                </span>
              </div>
            )}
          </div>
        )}

        {user.role === 'student' && (
          <div className="bg-indigo-50 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-3 gap-2 text-xs">
              {user.class && (
                <div>
                  <span className="text-indigo-600 font-medium">Class:</span>
                  <p className="text-indigo-900">{user.class}</p>
                </div>
              )}
              {user.section && (
                <div>
                  <span className="text-indigo-600 font-medium">Section:</span>
                  <p className="text-indigo-900">{user.section}</p>
                </div>
              )}
              {user.rollNumber && (
                <div>
                  <span className="text-indigo-600 font-medium">Roll:</span>
                  <p className="text-indigo-900">{user.rollNumber}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {user.role === 'teacher' && user.subject && user.subject.length > 0 && (
          <div className="bg-orange-50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <GraduationCap className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Subjects</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {user.subject.map((subj, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                  {subj}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          {user.accessApprovalDate && (
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Approved {new Date(user.accessApprovalDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2">
            {user.accountStatus === 'pending' && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => onApprove?.(user)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onReject?.(user)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {['trial', 'active'].includes(user.accountStatus) && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onSuspend?.(user)}
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <Shield className="w-3 h-3 mr-1" />
                {user.accountStatus === 'suspended' ? 'Unsuspend' : 'Suspend'}
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onViewDetails?.(user)}
            >
              <User className="w-3 h-3 mr-1" />
              Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
