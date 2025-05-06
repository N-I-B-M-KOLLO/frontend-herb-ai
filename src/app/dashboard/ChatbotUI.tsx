"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconLogout,
  IconHome,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatbotUI() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/login");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-900 overflow-hidden">
      {/* Sidebar - uses the built-in hover functionality */}
      <Sidebar>
        <SidebarBody>
          <SidebarLink
            link={{
              href: "/dashboard",
              label: "Home",
              icon: <IconHome size={20} />,
            }}
          />
          <SidebarLink
            link={{
              href: "/dashboard/chat",
              label: "Chat",
              icon: <IconMessageCircle size={20} />,
            }}
          />
          <SidebarLink
            link={{
              href: "/dashboard/settings",
              label: "Settings",
              icon: <IconSettings size={20} />,
            }}
          />
          <SidebarLink
            link={{
              href: "/login",
              label: "Logout",
              icon: <IconLogout size={20} />,
            }}
          />
        </SidebarBody>
      </Sidebar>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3 rounded-lg mb-3 ${
                message.isUser
                  ? "bg-blue-500 text-white ml-auto max-w-[80%]"
                  : "bg-gray-200 text-black mr-auto max-w-[80%]"
              }`}
            >
              {message.text}
              <span
                className={`block text-xs text-right mt-1 ${
                  message.isUser ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </span>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={(e) => {
              e.preventDefault();
              if (inputValue.trim()) {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    text: inputValue,
                    isUser: true,
                    timestamp: new Date(),
                  },
                ]);
                setInputValue("");

                // Simulate bot response
                setTimeout(() => {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      text: "This is a bot response.",
                      isUser: false,
                      timestamp: new Date(),
                    },
                  ]);
                }, 1000);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
