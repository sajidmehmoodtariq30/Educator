const AdminPaymentManagement = () => {
  return (
    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Management
        </h2>
        <p className="text-gray-600 mb-6">
          Verify payments and manage subscription statuses.
        </p>
        
        {/* Payment Management Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Payment Verifications</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">ABC School</p>
                  <p className="text-sm text-gray-600">Annual Plan - $299</p>
                  <p className="text-xs text-gray-500">Uploaded 2 hours ago</p>
                </div>
                <div className="space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    View
                  </button>
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
                  <p className="font-medium">XYZ Institute</p>
                  <p className="text-sm text-gray-600">Monthly Plan - $29</p>
                  <p className="text-xs text-gray-500">Uploaded 5 hours ago</p>
                </div>
                <div className="space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    View
                  </button>
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
            <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>This Month</span>
                <span className="font-bold text-green-600">$12,450</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span className="font-bold">$11,230</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Verifications</span>
                <span className="font-bold text-yellow-600">$2,340</span>
              </div>
              <div className="flex justify-between">
                <span>Total Revenue</span>
                <span className="font-bold text-blue-600">$156,780</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <p className="text-yellow-800">
            🚧 Full Payment Management interface is under development. More features coming soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentManagement;
