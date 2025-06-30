import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../lib/api';

const AdminOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingRequests: 0,
    trialUsers: 0,
    activeUsers: 0,
    expiredUsers: 0,
    totalPrincipals: 0,
    totalTeachers: 0,
    totalStudents: 0,
    pendingPayments: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminCards = [
    {
      title: 'Pending Approvals',
      description: 'Review and approve user registrations',
      count: loading ? '...' : stats.pendingRequests.toString(),
      color: 'blue',
      icon: '👥',
      gradient: 'from-blue-500 to-cyan-500',
      action: () => navigate('/admin/users?view=pending'),
      urgent: true
    },
    {
      title: 'Payment Verifications',
      description: 'Verify uploaded payment slips',
      count: loading ? '...' : stats.pendingPayments.toString(),
      color: 'green',
      icon: '💳',
      gradient: 'from-green-500 to-emerald-500',
      action: () => navigate('/admin/payments'),
      urgent: true
    },
    {
      title: 'School Management',
      description: 'Manage registered schools and institutions',
      count: loading ? '...' : stats.totalPrincipals.toString(),
      color: 'orange',
      icon: '🏫',
      gradient: 'from-orange-500 to-red-500',
      action: () => navigate('/admin/schools')
    },
    {
      title: 'Question Bank',
      description: 'Manage questions for tests',
      count: '247',
      color: 'purple',
      icon: '❓',
      gradient: 'from-purple-500 to-pink-500',
      action: () => navigate('/admin/questions')
    },
    {
      title: 'Total Users',
      description: 'Active platform users',
      count: loading ? '...' : stats.totalUsers.toString(),
      color: 'indigo',
      icon: '👤',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Active Tests',
      description: 'Currently running tests',
      count: '23',
      color: 'yellow',
      icon: '📝',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'System Health',
      description: 'Platform performance status',
      count: '98%',
      color: 'emerald',
      icon: '⚡',
      gradient: 'from-emerald-500 to-green-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl animate-glow">
              <span className="text-white text-2xl font-bold">⚡</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 animate-fade-in">
                Super Admin Control Center
              </h1>
              <p className="text-xl opacity-90 animate-slide-in-right">
                Manage the entire platform with powerful administrative tools
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Quick Actions - Urgent Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminCards.filter(card => card.urgent).map((card, index) => (
          <div
            key={card.title}
            onClick={card.action}
            className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-red-200 modern-card animate-scale-in"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {/* Urgent Badge */}
            <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
              URGENT
            </div>
            
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-14 h-14 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-2xl">{card.icon}</span>
                </div>
                <div className={`text-4xl font-bold text-transparent bg-gradient-to-r ${card.gradient} bg-clip-text`}>
                  {card.count}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                {card.description}
              </p>
            </div>
            
            {/* Action Button */}
            <div className="mt-4 flex justify-end">
              <button className={`px-4 py-2 bg-gradient-to-r ${card.gradient} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                Review Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* All Admin Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4"></span>
          Platform Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card, index) => (
            <div
              key={card.title}
              onClick={card.action}
              className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20 modern-card animate-scale-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Icon and Count */}
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-xl">{card.icon}</span>
                </div>
                <div className={`text-3xl font-bold text-transparent bg-gradient-to-r ${card.gradient} bg-clip-text`}>
                  {card.count}
                </div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors text-sm">
                  {card.description}
                </p>
              </div>
              
              {/* Arrow Icon */}
              {card.action && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">234ms</div>
            <div className="text-sm text-gray-600">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">1.2GB</div>
            <div className="text-sm text-gray-600">Memory Usage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">45%</div>
            <div className="text-sm text-gray-600">CPU Usage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
