import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Available Tests',
      description: 'Take available tests',
      count: '6',
      color: 'blue',
      icon: '📝',
      gradient: 'from-blue-500 to-cyan-500',
      action: () => navigate('/student/tests')
    },
    {
      title: 'My Results',
      description: 'View your test results',
      count: '15',
      color: 'green',
      icon: '📊',
      gradient: 'from-green-500 to-emerald-500',
      action: () => navigate('/student/results')
    },
    {
      title: 'Profile',
      description: 'Update your profile information',
      count: '👤',
      color: 'purple',
      icon: '⚙️',
      gradient: 'from-purple-500 to-pink-500',
      action: () => navigate('/student/profile')
    },
    {
      title: 'Performance',
      description: 'Track your progress',
      count: '85%',
      color: 'yellow',
      icon: '🎯',
      gradient: 'from-yellow-500 to-orange-500',
      action: () => {}
    },
    {
      title: 'Schedule',
      description: 'View upcoming tests',
      count: '📅',
      color: 'indigo',
      icon: '🗓️',
      gradient: 'from-indigo-500 to-purple-500',
      action: () => {}
    },
    {
      title: 'Achievements',
      description: 'View your achievements',
      count: '🏆',
      color: 'red',
      icon: '🎖️',
      gradient: 'from-red-500 to-pink-500',
      action: () => {}
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">
            Welcome to Your Learning Journey! 🎓
          </h1>
          <p className="text-xl opacity-90 max-w-2xl animate-slide-in-right">
            Track your progress, take tests, and achieve your academic goals with our modern learning platform.
          </p>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <div
            key={card.title}
            onClick={card.action}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20 modern-card animate-scale-in"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Icon */}
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
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                {card.description}
              </p>
            </div>
            
            {/* Arrow Icon */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg animate-slide-in-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">This Week</p>
              <p className="text-2xl font-bold">3 Tests Completed</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              ✅
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg animate-slide-in-left" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Average Score</p>
              <p className="text-2xl font-bold">85.2%</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              �
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg animate-slide-in-left" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Rank</p>
              <p className="text-2xl font-bold">#12 in Class</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              🏆
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
