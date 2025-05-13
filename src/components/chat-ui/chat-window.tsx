"use client";
import { RefObject } from 'react';
import { Message } from '@/app/dashboard/page';

// Define API base URL for resolving image paths
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

interface ChatWindowProps {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement>;
}

export function ChatWindow({ messages, messagesEndRef }: ChatWindowProps) {
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.isUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-zinc-800 dark:text-white'
                } ${message.isLoading ? 'animate-pulse' : ''}`}
              >
                {/* Show text message if present */}
                {message.text && (
                  <div className="prose dark:prose-invert break-words whitespace-pre-wrap">{message.text}</div>
                )}
                
                {/* Display base64 image with a proper check and better error logging */}
                {message.imageData && message.imageData.length > 0 && (
                  <div className={message.text ? "mt-3" : ""}>
                    <img 
                      src={`data:image/png;base64,${message.imageData}`} 
                      alt="Generated image" 
                      className="rounded-md max-w-full max-h-80 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        console.error("Image failed to load from base64 data:", e);
                        console.log("Base64 data length:", message.imageData?.length);
                        console.log("Base64 data preview:", message.imageData?.substring(0, 50) + "...");
                        
                        // Fall back to URL if base64 fails
                        if (message.imageUrl) {
                          console.log("Falling back to URL:", message.imageUrl);
                          (e.target as HTMLImageElement).src = message.imageUrl;
                        }
                      }}
                    />
                  </div>
                )}
                
                {/* Fallback to URL if base64 not available - FIXED URL RESOLUTION */}
                {(!message.imageData || message.imageData.length === 0) && message.imageUrl && (
                  <div className={message.text ? "mt-3" : ""}>
                    <img 
                      src={message.imageUrl.startsWith('http') ? message.imageUrl : `${API_BASE_URL}${message.imageUrl}`}
                      alt="Generated image" 
                      className="rounded-md max-w-full max-h-80 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        console.error("Image failed to load from URL:", img.src, e);
                      }}
                    />
                  </div>
                )}
                
                {/* Show loading indicators for image generation */}
                {message.isLoading && message.text === "Generating image..." && (
                  <div className="flex space-x-2 mt-2 justify-center">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                )}
                
                <div
                  className={`text-xs mt-1 ${
                    message.isUser ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6 max-w-md">
              <div className="text-4xl mb-4">👋</div>
              <h3 className="text-xl font-semibold mb-2">Welcome to AI Assistant</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start a conversation by typing a message below.
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}