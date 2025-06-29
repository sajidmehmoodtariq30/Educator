import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { authAPI } from "@/lib/api"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
})

export function LoginForm({
  className,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [loginStatus, setLoginStatus] = useState(null)
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setLoginStatus(null)
    
    try {
      const response = await authAPI.login(data)
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('accessToken', response.data.accessToken)
      
      setLoginStatus({
        type: 'success',
        message: 'Login successful! Redirecting...'
      })
      
      // Redirect based on user role
      setTimeout(() => {
        const user = response.data.user
        if (user.role === 'admin') {
          navigate('/admin/dashboard')
        } else if (user.role === 'principal') {
          navigate('/principal/dashboard')
        } else if (user.role === 'subadmin') {
          navigate('/principal/dashboard') // Same as principal
        } else if (user.role === 'teacher') {
          navigate('/teacher/dashboard')
        } else if (user.role === 'student') {
          navigate('/student/dashboard')
        } else {
          navigate('/dashboard')
        }
      }, 1000)
      
    } catch (error) {
      setLoginStatus({
        type: 'error',
        message: error.message || 'Login failed. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="flex">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-10 w-full">
            <div className="flex flex-col gap-8">
              {/* Header */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl mb-4 animate-glow">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-lg mt-2">
                  Sign in to continue your learning journey
                </p>
              </div>

              {loginStatus && (
                <div className={`p-4 rounded-xl text-sm font-medium ${
                  loginStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200 shadow-sm' 
                    : 'bg-red-50 text-red-800 border border-red-200 shadow-sm'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span>{loginStatus.type === 'success' ? '✅' : '❌'}</span>
                    <span>{loginStatus.message}</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <div className="relative">
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="pl-12 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      {...register("email")}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <span>❌</span>
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type="password"
                      placeholder="Enter your password"
                      className="pl-12 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      {...register("password")}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <span>❌</span>
                      <span>{errors.password.message}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                )}
              </Button>
              <div
                className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="flex items-center justify-center">
                <Button variant="outline" type="button" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor" />
                  </svg>
                  <span className="ml-2">Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link to="/terms">Terms of Service</Link>{" "}
        and <Link to="/privacy">Privacy Policy</Link>.
      </div>
    </div>
  );
}
