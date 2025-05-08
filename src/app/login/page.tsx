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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();
 
  const { setToken, setUser, isAuthenticated, logout } = useAuthStore();

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Only proceed if there's a stored token
        if (isAuthenticated) {
          // Verify the token is still valid by fetching user data
          await authService.getCurrentUser();
          // If successful, the token is valid
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // If token validation fails, log the user out
        logout();
        toast.error("Session expired, please login again");
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyToken();
  }, [isAuthenticated, logout]);

  // Only redirect after verification is complete
  useEffect(() => {
    if (!isVerifying && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isVerifying, isAuthenticated, router]);

  // React Query mutation for login
  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authService.login(username, password),
    onSuccess: async (data) => {
      setToken(data.access_token);
     
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
       
        toast.success("Login successful!");
       
        if (userData.is_admin) {
          router.push("/admin-dash/admin-dashboard");
        } else {
          router.push("/dashboard");
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Error getting user details");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Login failed");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  // Show loading state while verifying token
  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-lg">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-xl bg-white dark:bg-zinc-800 p-8 shadow-md dark:shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">Login</h2>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourusername"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
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
        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}