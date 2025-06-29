const AdminUserManagement = () => {
  return (
    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          User Management
        </h2>
        <p className="text-gray-600 mb-6">
          Manage user registrations, approvals, and account status.
        </p>
        
        {/* User Management Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-600">Teacher - ABC School</p>
                </div>
                <div className="space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                    Reject
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-gray-600">Principal - XYZ Institute</p>
                </div>
                <div className="space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Users</span>
                <span className="font-bold">1,284</span>
              </div>
              <div className="flex justify-between">
                <span>Active Users</span>
                <span className="font-bold text-green-600">1,156</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Approval</span>
                <span className="font-bold text-yellow-600">12</span>
              </div>
              <div className="flex justify-between">
                <span>Suspended</span>
                <span className="font-bold text-red-600">8</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <p className="text-yellow-800">
            🚧 Full User Management interface is under development. More features coming soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
