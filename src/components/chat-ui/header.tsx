"use client";

import { IconSettings, IconLogout } from "@tabler/icons-react";

interface HeaderProps {
  title: string;
  username: string;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}

export function Header({ title, username, onSettingsClick, onLogoutClick }: HeaderProps) {
  return (
    <div className="h-16 bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-between px-6">
      <h1 className="text-xl font-medium dark:text-white">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
            {username.charAt(0)}
          </div>
          <span className="ml-2 font-medium text-sm dark:text-white">{username}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Settings"
          >
            <IconSettings size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          
          <button
            onClick={onLogoutClick}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Logout"
          >
            <IconLogout size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}