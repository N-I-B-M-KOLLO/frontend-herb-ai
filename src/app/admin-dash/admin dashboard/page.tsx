/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";    
import { Card,CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();


  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user && !user.is_admin) {
      router.push("/dashboard");
      toast.error("You don't have permission to access the admin dashboard");
    }
  }, [isAuthenticated, user, router]);

 
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: authService.getAdminDashboard,
    enabled: isAuthenticated && user?.is_admin,
    retry: 1,
  });

 
  useEffect(() => {
    if (error) {
      toast.error("Failed to load admin dashboard data");
      
     
      if ((error as any).response?.status === 403) {
        router.push("/dashboard");
      }
    }
  }, [error, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
    toast.success("Logged out successfully");
  };

  if (!isAuthenticated || !user?.is_admin) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">Admin Dashboard</h1>
          <div className="space-x-4">
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              User Dashboard
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Control Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Welcome to the admin dashboard, {user.username}. Here you can manage users and system settings.
              </p>
              {isLoading ? (
                <p className="mt-4">Loading admin data...</p>
              ) : (
                <div className="mt-4">
                  <p><strong>Status:</strong> {data?.message}</p>
                  <p><strong>Admin:</strong> {data?.admin}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" disabled>
                  Manage Users
                </Button>
                <Button className="w-full" disabled>
                  System Settings
                </Button>
                <Button className="w-full" disabled>
                  View Logs
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Note: These are placeholder actions for the admin interface.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}