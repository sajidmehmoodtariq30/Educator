import { LoginForm } from '@/components/login-form'
import React from 'react'

const Login = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-30 animate-float" style={{animationDelay: '3s'}}></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login