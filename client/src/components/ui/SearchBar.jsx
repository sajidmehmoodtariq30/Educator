import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, Users, School, GraduationCap, User, UserCheck } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  onFilterChange, 
  placeholder = "Search users...",
  showFilters = true,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    accountStatus: '',
    institution: ''
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { role: '', accountStatus: '', institution: '' };
    setFilters(emptyFilters);
    onFilterChange?.(emptyFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const roleOptions = [
    { value: '', label: 'All Roles', icon: Users },
    { value: 'principal', label: 'Principals', icon: School },
    { value: 'subadmin', label: 'Sub Admins', icon: UserCheck },
    { value: 'teacher', label: 'Teachers', icon: GraduationCap },
    { value: 'student', label: 'Students', icon: User }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'trial', label: 'Trial' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-20 py-3 text-sm border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
          {showFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`text-gray-500 hover:text-gray-700 ${getActiveFilterCount() > 0 ? 'text-blue-600' : ''}`}
            >
              <Filter className="h-4 w-4" />
              {getActiveFilterCount() > 0 && (
                <span className="ml-1 text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && showFilterPanel && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Filter Options</h3>
            <div className="flex items-center space-x-2">
              {getActiveFilterCount() > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowFilterPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Role Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Role</label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.accountStatus}
                onChange={(e) => handleFilterChange('accountStatus', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Institution Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Institution</label>
              <Input
                type="text"
                placeholder="Search by institution..."
                value={filters.institution}
                onChange={(e) => handleFilterChange('institution', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {roleOptions.slice(1).map(option => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('role', filters.role === option.value ? '' : option.value)}
                    className={`text-xs ${filters.role === option.value ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
                  >
                    <IconComponent className="w-3 h-3 mr-1" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
