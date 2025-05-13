// SidebarDemo.tsx
"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  ArrowLeft,
  BrandTabler,
  Settings as SettingsIcon,
  User,
} from "tabler-icons-react";
import { Logo, LogoIcon } from "@/components/admin-ui/Logo";
import {Dashboard} from "@/components/admin-ui/Dashboard";
import Profile from "@/components/admin-ui/Profile";
import Settings from "@/components/admin-ui/Settings";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function SidebarDemo() {
  const [open, setOpen] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>("Dashboard");

  const handleNavigation = (label: string): void => {
    if (label === "Logout") {
      // In a real app, you would handle the logout logic here
      console.log("Logging out...");
      return;
    }
    setActivePage(label);
  };

  const links = [
    {
      label: "File Upload",
      href: "#",
      icon: (
        <BrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "View user Accounts",
      href: "#",
      icon: (
        <User className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile Settings",
      href: "#",
      icon: (
        <SettingsIcon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "/login",
      icon: (
        <ArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "File Upload":
        return <Dashboard />;
      case "View user Accounts":
        return <Profile />;
      case "Profile Settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div key={idx} onClick={() => handleNavigation(link.label)}>
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    width={28}
                    height={28}
                    src="/api/placeholder/48/48"
                    alt="Avatar"
                    className="h-7 w-7 shrink-0 rounded-full"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {renderPage()}
    </div>
  );
}