const StudentProfile = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          Edit Profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">John Doe</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">john.doe@example.com</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Student ID</label>
              <p className="mt-1 text-sm text-gray-900">STU-2024-001</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <p className="mt-1 text-sm text-gray-900">January 15, 2005</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <p className="mt-1 text-sm text-gray-900">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Institution</label>
              <p className="mt-1 text-sm text-gray-900">ABC High School</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grade/Class</label>
              <p className="mt-1 text-sm text-gray-900">Grade 10</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <p className="mt-1 text-sm text-gray-900">Section A</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <p className="mt-1 text-sm text-gray-900">15</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Academic Year</label>
              <p className="mt-1 text-sm text-gray-900">2024-2025</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Account Status</p>
              <p className="text-sm text-gray-600">Your account is active and verified</p>
            </div>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive test reminders and results</p>
            </div>
            <button className="bg-gray-200 relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-gray-600">Receive urgent notifications via SMS</p>
            </div>
            <button className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <div className="space-y-4">
          <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors">
            Change Password
          </button>
          <p className="text-sm text-gray-600">
            For security purposes, we recommend changing your password regularly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
