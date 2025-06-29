const PrincipalDashboard = () => {
  return (
    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Principal Dashboard
        </h2>
        <p className="text-gray-600 mb-6">
          Manage your institution, add teachers and students.
        </p>
        
        {/* Principal Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Manage Students</h3>
            <p className="text-gray-600">Add, edit, and manage students</p>
            <div className="mt-4 text-2xl font-bold text-blue-600">156</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Manage Teachers</h3>
            <p className="text-gray-600">Add and manage teaching staff</p>
            <div className="mt-4 text-2xl font-bold text-green-600">24</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Institution Settings</h3>
            <p className="text-gray-600">Configure institution preferences</p>
            <div className="mt-4 text-2xl font-bold text-purple-600">✓</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Test Overview</h3>
            <p className="text-gray-600">Monitor all tests in your institution</p>
            <div className="mt-4 text-2xl font-bold text-yellow-600">18</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Reports</h3>
            <p className="text-gray-600">View institution performance reports</p>
            <div className="mt-4 text-2xl font-bold text-indigo-600">📊</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Announcements</h3>
            <p className="text-gray-600">Send announcements to staff</p>
            <div className="mt-4 text-2xl font-bold text-red-600">📢</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
