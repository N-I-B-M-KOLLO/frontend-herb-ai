"use client";
import React, { useState, useCallback, JSX } from "react";

import { useDropzone } from "react-dropzone";

// Interface for password form data
interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Interface for confirmation modal props
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Confirmation Modal Component
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Confirm Account Deletion
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Settings: React.FC = (): JSX.Element => {
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    // Placeholder for password change logic
    console.log("Password change submitted:", passwordForm);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // Handle account deletion confirmation
  const handleDeleteAccount = () => {
    // Placeholder for account deletion logic
    console.log("Account deletion confirmed");
    setIsModalOpen(false);
  };

  // Handle image drop with react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      console.log("Uploaded file:", file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
    maxFiles: 1,
  });

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Settings Page
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mt-2 mb-8">
          Manage your account settings below
        </p>

        {/* Change Password Section */}
        <div className="max-w-md mx-auto mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-500"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Upload Profile Picture Section */}
        <div className="max-w-md mx-auto mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Upload Profile Picture
          </h2>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center ${
              isDragActive
                ? "border-blue-500 bg-blue-50 dark:bg-neutral-700"
                : "border-gray-300 dark:border-neutral-600"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-600 dark:text-gray-400">
              {isDragActive
                ? "Drop the image here..."
                : "Drag & drop an image here, or click to select one"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              (Only PNG and JPEG files are accepted)
            </p>
          </div>
          {uploadedImage && (
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-300 mb-2">Uploaded Image:</p>
              <img
                src={uploadedImage}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            </div>
          )}
        </div>

        {/* Delete Account Section */}
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Delete Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Permanently delete your account. This action cannot be undone.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 dark:hover:bg-red-500"
          >
            Delete Account
          </button>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteAccount}
        />
      </div>
    </div>
  );
};

export default Settings;