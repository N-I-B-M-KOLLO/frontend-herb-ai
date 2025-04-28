// app/login/page.tsx or wherever your Login component lives
"use client";
import React from "react";
import { Input } from "@/components/ui/input"; // adjust paths if needed
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // or wherever it is
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  // Define the handleAdminLoginClick function here
  const handleAdminLoginClick = () => {
    router.push("/admin"); // Navigate to the /admin page
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-xl bg-white dark:bg-zinc-800 p-8 shadow-md dark:shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">
          User Login
        </h2>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <div>
          <label
            htmlFor="adminLogin"
            className="block text-center cursor-pointer text-blue-500 hover:underline"
            onClick={handleAdminLoginClick} // Attach the function here
          >
            Admin Login
          </label>
        </div>
      </form>
    </div>
  );
}
