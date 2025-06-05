import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { authAPI } from "@/lib/api"

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required (minimum 2 characters)"),
  username: z.string().min(3, "Username is required (minimum 3 characters)").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Valid email address is required"),
  cnic: z.string().min(13, "CNIC is required (minimum 13 characters)").regex(/^[0-9-]+$/, "CNIC can only contain numbers and dashes"),
  phone: z.string().min(10, "Phone number is required (minimum 10 digits)"),
  address: z.string().min(5, "Address is required (minimum 5 characters)"),
  institutionName: z.string().min(2, "Institution name is required (minimum 2 characters)"),
  cnicImage: z.instanceof(FileList).refine(
    (files) => files && files.length > 0,
    "CNIC image is required"
  ).refine(
    (files) => !files || files.length === 0 || files[0]?.size <= 5000000,
    "File size must be less than 5MB"
  ).refine(
    (files) => !files || files.length === 0 || ["image/jpeg", "image/jpg", "image/png"].includes(files[0]?.type),
    "Only JPG and PNG files are allowed"
  ),
  password: z.string().min(8, "Password is required (minimum 8 characters)"),
  confirmPassword: z.string().min(1, "Password confirmation is required")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export function RegisterForm({
  className,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data) => {
    setIsLoading(true);
    setRegistrationStatus(null);
    
    try {
      const response = await authAPI.register(data);
      setRegistrationStatus({
        type: 'success',
        message: 'Registration request submitted successfully! Please wait for admin approval.'
      });
    } catch (error) {
      setRegistrationStatus({
        type: 'error',
        message: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="flex">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 w-full">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create Principal Account</h1>
                <p className="text-muted-foreground text-balance">
                  Register your institution and start managing your educational system
                </p>
              </div>              {registrationStatus && (
                <div className={`p-3 rounded-md text-sm ${
                  registrationStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {registrationStatus.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="John Doe" 
                    {...register("fullName")}
                  />
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="username">Username *</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="johndoe" 
                    {...register("username")}
                  />
                  {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="principal@example.com" 
                  {...register("email")}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="cnic">CNIC Number *</Label>
                  <Input 
                    id="cnic" 
                    type="text" 
                    placeholder="12345-6789012-3" 
                    {...register("cnic")}
                  />
                  {errors.cnic && <p className="text-sm text-red-500">{errors.cnic.message}</p>}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+923001234567" 
                    {...register("phone")}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="address">Institution Address *</Label>
                <Input 
                  id="address" 
                  type="text" 
                  placeholder="123 Main St, City, State" 
                  {...register("address")}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="institutionName">Institution Name *</Label>
                <Input 
                  id="institutionName" 
                  type="text" 
                  placeholder="ABC School & College" 
                  {...register("institutionName")}
                />
                {errors.institutionName && <p className="text-sm text-red-500">{errors.institutionName.message}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="cnicImage">CNIC Image *</Label>
                <Input 
                  id="cnicImage" 
                  type="file" 
                  accept="image/*"
                  className="file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                  {...register("cnicImage")}
                />
                <p className="text-xs text-muted-foreground">Upload a clear image of your CNIC (front or back). Max size: 5MB</p>
                {errors.cnicImage && <p className="text-sm text-red-500">{errors.cnicImage.message}</p>}              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="password">Password *</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter secure password"
                    {...register("password")}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Principal Account'}
              </Button>

              <div
                className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Registration Process
                </span>
              </div>

              <div className="text-center text-sm space-y-2">
                <div className="flex items-center justify-center space-x-1 text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Submit Registration</span>
                  <div className="w-4 border-t border-muted-foreground/30"></div>
                  <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
                  <span>Admin Approval</span>
                  <div className="w-4 border-t border-muted-foreground/30"></div>
                  <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
                  <span>15-Day Trial</span>
                </div>
              </div>
              
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By registering, you agree to our <Link to="/terms">Terms of Service</Link>{" "}
        and <Link to="/privacy">Privacy Policy</Link>. Your registration will be reviewed by our admin team.
      </div>
    </div>
  );
}
