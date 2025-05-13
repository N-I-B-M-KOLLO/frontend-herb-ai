"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useAuthStore } from "@/store/useAuthStore";
import { Photo, Send } from "tabler-icons-react";

interface ChatInputProps {
  placeholders: string[];
  onSendMessage: (text: string) => void;
  onGenerateImage?: (prompt: string) => void;
  isDisabled?: boolean;
}

export function ChatInput({ 
  placeholders, 
  onSendMessage, 
  onGenerateImage, 
  isDisabled = false 
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const { user } = useAuthStore();
  
  const isPremiumUser = user?.user_plan === "premium";

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (!inputValue.trim() || isDisabled) return;
    
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleGenerateImage = () => {
    if (!inputValue.trim() || isDisabled || !onGenerateImage) return;
    
    onGenerateImage(inputValue);
    setInputValue("");
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={handleSubmit}
            disabled={isDisabled}
            value={inputValue}
            className="flex-grow mr-2"
          />
          
          <div className="flex space-x-2">
            {isPremiumUser && onGenerateImage && (
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={isDisabled || !inputValue.trim()}
                className={`p-2 rounded-full ${
                  isDisabled || !inputValue.trim()
                    ? "bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-800/50"
                }`}
                title="Generate image"
              >
                <Photo size={20} />
              </button>
            )}
            
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
              }}
              disabled={isDisabled || !inputValue.trim()}
              className={`p-2 rounded-full ${
                isDisabled || !inputValue.trim()
                  ? "bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              }`}
              title="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}