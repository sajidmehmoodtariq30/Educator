import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const ClassSelector = ({ onClassSelect, selectedClass, stats }) => {
  const classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const getClassGradient = (classNum) => {
    const gradients = [
      'from-red-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-yellow-500 to-orange-500',
      'from-green-500 to-yellow-500',
      'from-teal-500 to-green-500',
      'from-blue-500 to-teal-500',
      'from-indigo-500 to-blue-500',
      'from-purple-500 to-indigo-500',
      'from-pink-500 to-purple-500',
      'from-rose-500 to-pink-500'
    ];
    return gradients[classNum - 1] || gradients[0];
  };

  const getClassIcon = (classNum) => {
    const icons = ['🌱', '🌿', '🌳', '🍃', '🌊', '⭐', '🌙', '🔥', '💎', '👑'];
    return icons[classNum - 1] || '📚';
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl animate-glow">
              <span className="text-white text-2xl font-bold">❓</span>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2 animate-fade-in">
                Question Management Hub
              </h1>
              <p className="text-xl opacity-90 animate-slide-in-right">
                Select a class to create and manage questions
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats?.reduce((sum, s) => sum + (s.totalQuestions || 0), 0) || 0}</div>
              <div className="text-sm opacity-80">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats?.length || 0}</div>
              <div className="text-sm opacity-80">Active Classes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats?.reduce((sum, s) => sum + (s.activeQuestions || 0), 0) || 0}</div>
              <div className="text-sm opacity-80">Active Questions</div>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Class Selection */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4"></span>
            Choose Your Class
            <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full ml-4"></span>
          </h2>
          <p className="text-gray-600">Click on any class to start managing questions</p>
        </div>

        {/* Class Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {classes.map((classNum, index) => {
            const classStats = stats?.find(s => s.class === classNum);
            const questionCount = classStats?.totalQuestions || 0;
            const isSelected = selectedClass === classNum;
            
            return (
              <div
                key={classNum}
                onClick={() => onClassSelect(classNum)}
                className={`group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 modern-card animate-scale-in ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50/80 scale-105' 
                    : 'border-white/20 hover:border-blue-200'
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${getClassGradient(classNum)}`}></div>
                
                {/* Content */}
                <CardContent className="p-6 text-center relative">
                  {/* Background Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 text-8xl">
                    {getClassIcon(classNum)}
                  </div>
                  
                  {/* Main Content */}
                  <div className="relative z-10">
                    {/* Class Number with Gradient */}
                    <div className={`text-4xl font-bold text-transparent bg-gradient-to-r ${getClassGradient(classNum)} bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300`}>
                      {classNum}
                    </div>
                    
                    {/* Class Label */}
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      Class {classNum}
                    </div>
                    
                    {/* Question Count */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      <div className="text-lg font-bold text-gray-800">{questionCount}</div>
                      <div className="text-xs text-gray-600">Questions</div>
                    </div>
                    
                    {/* Status Indicators */}
                    <div className="flex justify-center space-x-2">
                      {questionCount > 0 && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      )}
                      {questionCount === 0 && (
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${getClassGradient(classNum)} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}></div>
                </CardContent>
                
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center justify-center">
            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">💡</span>
            Quick Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-blue-500">✓</span>
              <span>Click any class to start managing questions</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-blue-500">✓</span>
              <span>Green dot indicates classes with questions</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-blue-500">✓</span>
              <span>Create, edit, and organize by subject</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSelector;
