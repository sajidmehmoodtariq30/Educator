import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardLayout from './components/layout/DashboardLayout'

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview'
import AdminUserManagement from './pages/admin/AdminUserManagement'
import AdminPaymentManagement from './pages/admin/AdminPaymentManagement'
import QuestionManagement from './pages/QuestionManagement'

// Principal Pages
import PrincipalDashboard from './pages/principal/PrincipalDashboard'

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard'

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard'
import StudentTests from './pages/student/StudentTests'
import StudentResults from './pages/student/StudentResults'
import StudentProfile from './pages/student/StudentProfile'

const App = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Dashboard routes with layout */}
      <Route path="/" element={<DashboardLayout />}>
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminOverview />} />
        <Route path="/admin/questions" element={<QuestionManagement />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
        <Route path="/admin/payments" element={<AdminPaymentManagement />} />
        
        {/* Principal Routes */}
        <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/tests" element={<StudentTests />} />
        <Route path="/student/results" element={<StudentResults />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        
        {/* Legacy dashboard route - redirect based on role */}
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
   </BrowserRouter>
  )
}


export default App