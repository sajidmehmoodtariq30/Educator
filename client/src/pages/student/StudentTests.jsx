const StudentTests = () => {
  const tests = [
    {
      id: 1,
      title: 'Mathematics Test',
      description: 'Basic algebra and geometry concepts',
      duration: 60,
      questions: 30,
      status: 'active',
      difficulty: 'Medium',
      subject: 'Math',
      dueDate: 'Today',
      gradient: 'from-blue-500 to-cyan-500',
      icon: '📐'
    },
    {
      id: 2,
      title: 'Science Quiz',
      description: 'Physics and chemistry fundamentals',
      duration: 45,
      questions: 25,
      status: 'scheduled',
      difficulty: 'Hard',
      subject: 'Science',
      dueDate: 'Tomorrow',
      gradient: 'from-green-500 to-emerald-500',
      icon: '🧪'
    },
    {
      id: 3,
      title: 'English Literature',
      description: 'Reading comprehension and analysis',
      duration: 90,
      questions: 40,
      status: 'expired',
      difficulty: 'Easy',
      subject: 'English',
      dueDate: 'Yesterday',
      gradient: 'from-purple-500 to-pink-500',
      icon: '📚'
    },
    {
      id: 4,
      title: 'History Assignment',
      description: 'World War II and its consequences',
      duration: 120,
      questions: 50,
      status: 'active',
      difficulty: 'Medium',
      subject: 'History',
      dueDate: 'In 3 days',
      gradient: 'from-yellow-500 to-orange-500',
      icon: '🏛️'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Active', icon: '✅' },
      scheduled: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Scheduled', icon: '⏰' },
      expired: { color: 'bg-red-100 text-red-800 border-red-200', text: 'Expired', icon: '❌' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'text-green-600',
      Medium: 'text-yellow-600',
      Hard: 'text-red-600'
    };
    return colors[difficulty] || 'text-gray-600';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4 animate-fade-in">
                Available Tests 📝
              </h1>
              <p className="text-xl opacity-90 animate-slide-in-right">
                Challenge yourself and showcase your knowledge
              </p>
              <div className="flex items-center space-x-6 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span>4 Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>1 Scheduled</span>
                </div>
              </div>
            </div>
            <div className="text-right animate-scale-in">
              <div className="text-3xl font-bold mb-1">{new Date().toLocaleDateString()}</div>
              <div className="text-sm opacity-80">Today's Date</div>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl font-medium hover:bg-blue-200 transition-colors">
            All Tests
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            Active
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            Scheduled
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Science</option>
            <option>English</option>
            <option>History</option>
          </select>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((test, index) => (
          <div
            key={test.id}
            className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 modern-card animate-scale-in"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {/* Gradient Header */}
            <div className={`h-2 bg-gradient-to-r ${test.gradient}`}></div>
            
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${test.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white text-xl">{test.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {test.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">{test.subject}</p>
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
                {test.description}
              </p>

              {/* Test Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <span>⏱️</span>
                    <span>Duration</span>
                  </div>
                  <div className="font-bold text-gray-800">{test.duration} minutes</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <span>📊</span>
                    <span>Questions</span>
                  </div>
                  <div className="font-bold text-gray-800">{test.questions}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <span>🎯</span>
                    <span>Difficulty</span>
                  </div>
                  <div className={`font-bold ${getDifficultyColor(test.difficulty)}`}>
                    {test.difficulty}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <span>📅</span>
                    <span>Due</span>
                  </div>
                  <div className="font-bold text-gray-800">{test.dueDate}</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                {test.status === 'active' && (
                  <button className={`px-6 py-3 bg-gradient-to-r ${test.gradient} text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2`}>
                    <span>Start Test</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
                {test.status === 'scheduled' && (
                  <button className="px-6 py-3 bg-gray-200 text-gray-600 rounded-xl font-medium cursor-not-allowed flex items-center space-x-2">
                    <span>Starts {test.dueDate}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
                {test.status === 'expired' && (
                  <button className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-medium cursor-not-allowed flex items-center space-x-2">
                    <span>Expired</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">💡</span>
          Test Taking Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-blue-500">✓</span>
            <span>Read all questions carefully before starting</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-500">✓</span>
            <span>Manage your time effectively during the test</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-500">✓</span>
            <span>Review your answers before submitting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTests;
