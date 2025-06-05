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
      <Card className="overflow-hidden p-0">
        <CardContent className="flex">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 w-full">
            <div className="flex flex-col gap-6">              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>

              {loginStatus && (
                <div className={`p-3 rounded-md text-sm ${
                  loginStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {loginStatus.message}
                </div>
              )}

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
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
