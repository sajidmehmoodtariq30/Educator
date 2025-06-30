import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { schoolAPI } from '../../lib/api';
import { 
  School, 
  Users, 
  GraduationCap, 
  UserCheck, 
  User,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  Settings,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  AlertCircle,
  XCircle,
  Crown
} from 'lucide-react';

const SchoolCard = ({ 
  school, 
  onUpdate,
  compact = false 
}) => {
  const [loading, setLoading] = useState(false);

  const handleStatusToggle = async () => {
    try {
      setLoading(true);
      const newStatus = school.status === 'active' ? 'inactive' : 'active';
      await schoolAPI.updateSchoolSettings(school._id, { status: newStatus });
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Error updating school status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <AlertCircle className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'basic': return 'text-blue-600 bg-blue-100';
      case 'standard': return 'text-purple-600 bg-purple-100';
      case 'premium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (compact) {
    return (
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <School className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{school.name}</h3>
              <p className="text-sm text-gray-600">Principal: {school.principalId?.fullName}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {school.currentStudentCount + school.currentTeacherCount + school.currentSubAdminCount}
              </div>
              <div className="text-xs text-gray-500">Total Users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20">
      <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{school.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-gray-600">{school.principalId?.fullName}</span>
              </div>
              {(school.city || school.state) && (
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {[school.city, school.state].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {school.currentStudentCount + school.currentTeacherCount + school.currentSubAdminCount}
            </div>
            <div className="text-xs text-gray-500">Total Users</div>
          </div>
        </div>

        {/* Status and Plan Badges */}
        <div className="flex items-center space-x-2 mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(school.status)}`}>
            {getStatusIcon(school.status)}
            <span className="ml-1 capitalize">{school.status}</span>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(school.subscriptionPlan)}`}>
            <span className="capitalize">{school.subscriptionPlan}</span>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <UserCheck className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm font-semibold text-green-900">
              {school.currentSubAdminCount}
            </div>
            <div className="text-xs text-green-600">Sub Admins</div>
            <div className="text-xs text-gray-500 mt-1">
              Max: {school.maxSubAdminsAllowed}
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <GraduationCap className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-sm font-semibold text-orange-900">
              {school.currentTeacherCount}
            </div>
            <div className="text-xs text-orange-600">Teachers</div>
            <div className="text-xs text-gray-500 mt-1">
              Max: {school.maxTeachersAllowed}
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-sm font-semibold text-indigo-900">
              {school.currentStudentCount}
            </div>
            <div className="text-xs text-indigo-600">Students</div>
            <div className="text-xs text-gray-500 mt-1">
              Max: {school.maxStudentsAllowed}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        {(school.email || school.phone || school.website) && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="space-y-2">
              {school.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{school.email}</span>
                </div>
              )}
              {school.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{school.phone}</span>
                </div>
              )}
              {school.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{school.website}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Created: {new Date(school.createdAt).toLocaleDateString()}</span>
          </div>
          {school.approvedBy && (
            <span>Approved by: {school.approvedBy.fullName}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleStatusToggle}
            disabled={loading}
            size="sm"
            variant={school.status === 'active' ? 'outline' : 'default'}
            className="flex-1"
          >
            {loading ? (
              'Loading...'
            ) : school.status === 'active' ? (
              'Deactivate'
            ) : (
              'Activate'
            )}
          </Button>
          
          <Button
            onClick={() => window.open(`/admin/schools/${school._id}`, '_blank')}
            size="sm"
            variant="outline"
            className="flex items-center space-x-1"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </Button>
          
          <Button
            onClick={() => window.open(`/admin/schools/${school._id}/settings`, '_blank')}
            size="sm"
            variant="outline"
            className="flex items-center space-x-1"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
                  Expires: {new Date(school.subscriptionInfo.expiryDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Est. {new Date(school.establishedDate || school.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={() => onViewDetails?.(school)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Eye className="w-3 h-3 mr-1" />
            View Details
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onManageUsers?.(school)}
            className="flex-1"
          >
            <Settings className="w-3 h-3 mr-1" />
            Manage Users
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolCard;
