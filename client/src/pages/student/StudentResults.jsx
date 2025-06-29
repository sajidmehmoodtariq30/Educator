const StudentResults = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Results</h2>
        <div className="text-sm text-gray-600">
          Overall Average: <span className="font-bold text-green-600">85%</span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Results</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Mathematics Test
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2024-06-25
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  24/30
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    A-
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <button className="hover:text-blue-900">View Details</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Science Quiz
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2024-06-20
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  22/25
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    A
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <button className="hover:text-blue-900">View Details</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  History Assignment
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2024-06-15
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  18/25
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    B-
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <button className="hover:text-blue-900">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Mathematics</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
                <span className="text-sm font-medium">80%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Science</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '88%'}}></div>
                </div>
                <span className="text-sm font-medium">88%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>History</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '72%'}}></div>
                </div>
                <span className="text-sm font-medium">72%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                🏆
              </div>
              <div>
                <p className="font-medium">Perfect Score</p>
                <p className="text-sm text-gray-600">Achieved in Science Quiz</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                📚
              </div>
              <div>
                <p className="font-medium">Consistent Performer</p>
                <p className="text-sm text-gray-600">5 consecutive A grades</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                ⚡
              </div>
              <div>
                <p className="font-medium">Quick Learner</p>
                <p className="text-sm text-gray-600">Completed tests early</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResults;
