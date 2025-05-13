/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  sub: string;
  user_plan: string;
  is_admin: boolean;
  exp: number;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const router = useRouter();
  const { setToken, setUser, isAuthenticated, user } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on admin status
      if (user?.is_admin) {
        router.push("/admin-dash/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, router, user]);
  
  // React Query mutation for login
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return await authService.login(credentials.username, credentials.password);
    },
    onSuccess: async (data) => {
      // Set the token in auth store
      setToken(data.access_token);
      
      try {
        // Decode the JWT token to get user info
        const decodedToken = jwtDecode<TokenPayload>(data.access_token);
        
        // Set the user in auth store with data from the token
        setUser({
          id: 0, // We don't have the ID in the token, will be updated when fetching user details
          username: decodedToken.sub,
          is_admin: decodedToken.is_admin,
          user_plan: decodedToken.user_plan
        });
        
        // Get complete user details
        const userData = await authService.getCurrentUser();
        setUser({
          id: userData.id,
          username: userData.username,
          is_admin: userData.is_admin,
          user_plan: userData.user_plan
        });
        
        toast.success("Login successful!");
        
        // Redirect based on admin status
        if (userData.is_admin) {
          router.push("/admin-dash/admin-dashboard");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error processing token:", error);
        toast.error("Something went wrong with authentication");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Invalid credentials");
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white dark:bg-zinc-800 p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black font-[Poppins] dark:text-white">Welcome back</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 font-[Poppins] ">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm font-[Poppins]  font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm font-[Poppins] font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full py-2.5"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
          
          <div className="text-center mt-4 text-sm font-[Poppins] text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 font-[Poppins] dark:text-blue-400 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}