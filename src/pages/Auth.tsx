
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Registration form schema
const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Reset password schema
const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

const Auth = () => {
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loading, setLoading] = useState<boolean>(false);
  
  // Get the redirect path from location state, or default to "/"
  const from = (location.state as any)?.from || "/";
  
  // If the user is already logged in, redirect them
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await signIn(values.email, values.password);
      // The redirect will happen in the useEffect above once the user state is updated
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      await signUp(values.email, values.password, {
        name: values.name,
      });
      // After signup, they'll need to verify their email, so we stay on the auth page
      setActiveTab("login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onResetSubmit = async (values: ResetFormValues) => {
    setLoading(true);
    try {
      await resetPassword(values.email);
      // After requesting a reset, we show a success message and stay on the page
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-supernova-navy to-supernova-navy/80">
      <div className="container max-w-md mx-auto py-12 flex-1 flex items-center justify-center px-6">
        <Card className="w-full border-supernova-gold/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo size="lg" />
            </div>
            <CardTitle className="text-2xl font-bold text-supernova-gold">
              {activeTab === "login" ? "Welcome Back" : activeTab === "register" ? "Create Account" : "Reset Password"}
            </CardTitle>
            <CardDescription>
              {activeTab === "login" 
                ? "Sign in to access your premium newsletters" 
                : activeTab === "register" 
                ? "Join WealthSuperNova for exclusive investment insights" 
                : "Enter your email to receive reset instructions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
                <TabsTrigger value="reset">Reset</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-supernova-gold hover:bg-supernova-gold/90 text-black"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-supernova-gold hover:bg-supernova-gold/90 text-black"
                      disabled={loading}
                    >
                      {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="reset">
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-supernova-gold hover:bg-supernova-gold/90 text-black"
                      disabled={loading}
                    >
                      {loading ? "Sending reset email..." : "Send Reset Link"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            WealthSuperNova &copy; {new Date().getFullYear()} • All Rights Reserved
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
