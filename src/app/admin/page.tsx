"use client";
import React, { useState } from "react";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  // State for form inputs and validation errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validation logic
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // If there are validation errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle successful form submission (e.g., API call)
    console.log("Admin form submitted:", { email, password });
  };

  const handleLoginClick = () => {
    router.push("/login"); // Navigate back to the user login page
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4">
      <form
        onSubmit={handleSubmit}
        noValidate // Disable browser's native validation
        className="w-full max-w-sm space-y-6 rounded-xl bg-white dark:bg-zinc-800 p-8 shadow-md dark:shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">
          Admin Login
        </h2>

        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <Button type="submit" className="w-full">
          Login
        </Button>

        <div>
          <label
            htmlFor="backToLogin"
            className="block text-center cursor-pointer text-blue-500 hover:underline"
            onClick={handleLoginClick}
          >
            Back to User Login
          </label>
        </div>
      </form>
    </div>
  );
}
