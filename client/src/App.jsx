import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Dashboard routes for all roles */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/principal/dashboard" element={<Dashboard />} />
      <Route path="/teacher/dashboard" element={<Dashboard />} />
      <Route path="/student/dashboard" element={<Dashboard />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
   </BrowserRouter>
  )
}


export default App