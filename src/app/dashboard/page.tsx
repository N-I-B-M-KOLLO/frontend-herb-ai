"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card,CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  
  const {  isLoading, error } = useQuery({
    queryKey: ['regularDashboard'],
    queryFn: authService.getRegularDashboard,
    enabled: isAuthenticated,
    retry: 1,
  });

 
  useEffect(() => {
    if (error) {
      toast.error("Failed to load dashboard data");
    }
  }, [error]);

  const handleLogout = () => {
    logout();
    router.push("/login");
    toast.success("Logged out successfully");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">User Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome {user?.username}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                This is your personal dashboard. Here you can manage your account and view your data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="space-y-2">
                  <p><strong>Username:</strong> {user?.username}</p>
                 
                  <p><strong>Role:</strong> {user?.is_admin ? 'Administrator' : 'Regular User'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}