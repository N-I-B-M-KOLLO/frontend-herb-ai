"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  IconChevronLeft, 
  IconChevronRight,
  IconLogout
} from "@tabler/icons-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatbotUI() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue("");
    
    
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Response to: ${inputValue}`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-900 overflow-hidden">
      {/* Sidebar */}
      <motion.div
        className="h-full bg-white dark:bg-zinc-800 shadow-lg flex flex-col relative"
        initial={{ width: "64px" }}
        animate={{ width: isExpanded ? "250px" : "64px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex-1 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-medium dark:text-white"
            >
              Chat History
            </motion.h2>
            <button
              onClick={toggleSidebar}
              className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center"
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isExpanded ? (
                <IconChevronLeft size={20} className="text-gray-500 dark:text-gray-300" />
              ) : (
                <IconChevronRight size={20} className="text-gray-500 dark:text-gray-300" />
              )}
            </button>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-3 py-2 overflow-y-auto max-h-[calc(100%-120px)]"
              >
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="mb-2 p-2 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${message.isUser ? 'bg-blue-500' : 'bg-green-500'}`} />
                        <p className="text-sm truncate dark:text-white">
                          {message.text.length > 20 ? `${message.text.substring(0, 20)}...` : message.text}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 ml-4 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center p-4">
                    No messages yet
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Logout Button (Only visible when expanded) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => router.push("/login")}
              className="mx-4 my-3 p-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 text-red-500"
            >
              <IconLogout size={20} className="mr-2" />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-zinc-700 w-full" />
        
        {/* User Info */}
        <div className="p-4 flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
            U
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3"
              >
                <p className="text-sm font-medium dark:text-white">Username</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="h-16 bg-white dark:bg-zinc-800 shadow-sm flex items-center px-6">
          <h1 className="text-xl font-medium dark:text-white">AI Assistant</h1>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-zinc-900">
          <div className="max-w-4xl mx-auto">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-zinc-800 dark:text-white rounded-bl-none shadow'
                    }`}
                  >
                    <p>{message.text}</p>
                    <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="text-4xl mb-2">👋</div>
                  <h3 className="text-xl font-medium mb-2 dark:text-white">Welcome to AI Assistant</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Start a conversation by typing a message below.
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotUI;