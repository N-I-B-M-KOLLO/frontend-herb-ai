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
import { PlanSelection, PlanType } from "@/components/ui/PlanSelection";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("free");
 
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
 
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);
 
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);
  
  // React Query mutation for signup
  const signupMutation = useMutation({
    mutationFn: (userData: { username: string; password: string; plan: PlanType }) =>
      authService.register(userData),
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/login");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Signup failed");
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
   
    signupMutation.mutate({ username, password, plan: selectedPlan });
  };
  
  const handlePlanChange = (plan: PlanType) => {
    setSelectedPlan(plan);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl space-y-8 rounded-xl bg-white dark:bg-zinc-800 p-8 shadow-md dark:shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center font-[Poppins]  text-black dark:text-white mb-8">Create an Account</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left column - User credentials */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-black font-[Poppins] dark:text-white mb-4">Account Details</h3>
            
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
              
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-[Poppins] font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-1"
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column - Plan selection */}
          <div className="md:border-l md:pl-8 md:pt-0 pt-6 border-gray-200 dark:border-gray-700">
            <PlanSelection selectedPlan={selectedPlan} onPlanChange={handlePlanChange} />
          </div>
        </div>
        
        {/* Action buttons and links - now below all input fields */}
        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="submit"
            className="w-full py-2.5 text-base"
            disabled={signupMutation.isPending || !!passwordError}
          >
            {signupMutation.isPending ? "Creating Account..." : "Sign Up"}
          </Button>
          
          <div className="text-center mt-4 text-sm font-[Poppins] text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}