const TeacherDashboard = () => {
  return (
    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Teacher Dashboard
        </h2>
        <p className="text-gray-600 mb-6">
          Create and manage tests for your students.
        </p>
        
        {/* Teacher Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Create Test</h3>
            <p className="text-gray-600">Create new tests for students</p>
            <div className="mt-4 text-3xl font-bold text-blue-600">+</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">My Tests</h3>
            <p className="text-gray-600">View and manage your tests</p>
            <div className="mt-4 text-2xl font-bold text-green-600">12</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Results</h3>
            <p className="text-gray-600">View student test results</p>
            <div className="mt-4 text-2xl font-bold text-purple-600">45</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">My Students</h3>
            <p className="text-gray-600">Manage your assigned students</p>
            <div className="mt-4 text-2xl font-bold text-yellow-600">78</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Question Bank</h3>
            <p className="text-gray-600">Access and manage questions</p>
            <div className="mt-4 text-2xl font-bold text-indigo-600">234</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">View performance analytics</p>
            <div className="mt-4 text-2xl font-bold text-red-600">📈</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
