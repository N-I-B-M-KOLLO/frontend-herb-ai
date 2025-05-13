"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconX, 
  IconChevronDown, 
  IconUserCircle, 
  IconCrown,
  IconAlertCircle
} from "@tabler/icons-react";
import { PlanSelection, PlanType } from "@/components/ui/PlanSelection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/api";
import { toast } from "react-hot-toast"; 

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccordionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Accordion = ({ title, icon, children }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border dark:border-zinc-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 text-left"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium dark:text-white">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <IconChevronDown className="text-gray-500 dark:text-gray-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white dark:bg-zinc-900">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("standard");
  const [passwordError, setPasswordError] = useState("");
  
  const queryClient = useQueryClient();

  // Password update mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (data: { current_password: string; new_password: string }) => 
      authService.updatePassword(data),
    onSuccess: () => {
      // Reset form fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      
      // Show success message
      toast.success("Password updated successfully!");
    },
    onError: (error: any) => {
      // Handle error - display message to user
      const errorMessage = error.response?.data?.detail || "Failed to update password. Please try again.";
      toast.error(errorMessage);
    }
  });

  // Plan update mutation
  const updatePlanMutation = useMutation({
    mutationFn: (plan: string) => authService.updateUserPlan(plan),
    onSuccess: () => {
      // Invalidate and refetch user data to get updated plan
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success(`Plan updated to ${selectedPlan} successfully!`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || "Failed to update plan. Please try again.";
      toast.error(errorMessage);
    }
  });

  const handlePlanChange = (plan: PlanType) => {
    setSelectedPlan(plan);
  };

  const handleConfirmPlanChange = () => {
    updatePlanMutation.mutate(selectedPlan);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match!");
      return;
    }
    
    // Validate password length
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    
    // Submit password update
    updatePasswordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
         
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-zinc-800 shadow-xl z-50 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium dark:text-white">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Close settings"
              >
                <IconX size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
           
            <div className="space-y-6">
              {/* Update User Info Accordion */}
              <Accordion 
                title="Update Password" 
                icon={<IconUserCircle size={20} className="text-blue-500" />}
              >
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {passwordError && (
                    <div className="text-red-500 flex items-center gap-2 text-sm">
                      <IconAlertCircle size={16} />
                      {passwordError}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={updatePasswordMutation.isPending}
                  >
                    {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </Accordion>
              
              {/* Change User Plan Accordion */}
              <Accordion 
                title="Change User Plan" 
                icon={<IconCrown size={20} className="text-yellow-500" />}
              >
                <div className="py-2">
                  <PlanSelection 
                    selectedPlan={selectedPlan} 
                    onPlanChange={handlePlanChange} 
                  />
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleConfirmPlanChange}
                      disabled={updatePlanMutation.isPending}
                      className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatePlanMutation.isPending ? "Updating..." : "Confirm Plan Change"}
                    </button>
                  </div>
                </div>
              </Accordion>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}