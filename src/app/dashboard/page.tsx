"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/chat-ui/header";
import { ChatWindow } from "@/components/chat-ui/chat-window";
import { ChatInput } from "@/components/chat-ui/chat-input";
import { SettingsDrawer } from "@/components/chat-ui/settings-drawer";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { documentApi } from "@/lib/ai-service/documentApi";
import imageApi from "@/lib/ai-service/ImageApi";

// Define API base URL for resolving image paths
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  imageUrl?: string;
  imageData?: string; 
}

export default function ChatbotUI() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { logout, user } = useAuthStore();
 
  const placeholders: string[] = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  // Mutation for querying documents
  const queryMutation = useMutation({
    mutationFn: ({ query, documentId }: { query: string; documentId?: number }) => 
      documentApi.queryDocument(query, documentId),
    onSuccess: (data) => {
      // Update the loading message with the actual response
      setMessages(prev => {
        const newMessages = [...prev];
        // Find and replace the loading message with the actual response
        const loadingIndex = newMessages.findIndex(msg => msg.isLoading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            id: Date.now().toString(),
            text: data.data.response,
            isUser: false,
            timestamp: new Date(),
            isLoading: false
          };
        } else {
          // If no loading message is found (shouldn't happen), add a new message
          newMessages.push({
            id: Date.now().toString(),
            text: data.data.response,
            isUser: false,
            timestamp: new Date()
          });
        }
        return newMessages;
      });
    },
    onError: () => {
      // Update the loading message with an error message
      setMessages(prev => {
        const newMessages = [...prev];
        // Find and replace the loading message with an error message
        const loadingIndex = newMessages.findIndex(msg => msg.isLoading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            id: Date.now().toString(),
            text: "Sorry, there was an error processing your request. Please try again.",
            isUser: false,
            timestamp: new Date(),
            isLoading: false
          };
        } else {
          // If no loading message is found, add a new error message
          newMessages.push({
            id: Date.now().toString(),
            text: "Sorry, there was an error processing your request. Please try again.",
            isUser: false,
            timestamp: new Date()
          });
        }
        return newMessages;
      });
    }
  });

  // Mutation for image generation - FIXED
  const imageMutation = useMutation({
    mutationFn: (prompt: string) => imageApi.generateImage(prompt),
    onSuccess: (data) => {
      console.log("Image generation successful:", data);
      console.log("Image URL:", data.image_url);
      console.log("Image Data length:", data.image_data ? data.image_data.length : 0);
      console.log("Image Data preview:", data.image_data ? data.image_data.substring(0, 50) + "..." : "none");
      
      // Add the generated image as a new message with fixed property mapping
      setMessages(prev => {
        const newMessages = [...prev];
        // Find and replace the loading message with the actual image
        const loadingIndex = newMessages.findIndex(msg => msg.isLoading && msg.text === "Generating image...");
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            id: Date.now().toString(),
            text: "Generated image:", // Add some text to prevent empty message
            isUser: false,
            timestamp: new Date(),
            isLoading: false,
            // Properly resolve the image URL if it's a relative path
            imageUrl: data.image_url?.startsWith('http') 
              ? data.image_url 
              : `${API_BASE_URL}${data.image_url}`,
            imageData: data.image_data || "" // Ensure we have a string value
          };
        } else {
          // If no loading message is found, add a new message
          newMessages.push({
            id: Date.now().toString(),
            text: "Generated image:",
            isUser: false,
            timestamp: new Date(),
            // Properly resolve the image URL if it's a relative path
            imageUrl: data.image_url?.startsWith('http') 
              ? data.image_url 
              : `${API_BASE_URL}${data.image_url}`,
            imageData: data.image_data || ""
          });
        }
        return newMessages;
      });
    },
    onError: (error) => {
      console.error("Image generation error:", error);
      // Update the loading message with an error message
      setMessages(prev => {
        const newMessages = [...prev];
        // Find and replace the loading message with an error message
        const loadingIndex = newMessages.findIndex(msg => msg.isLoading && msg.text === "Generating image...");
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            id: Date.now().toString(),
            text: "Sorry, there was an error generating the image. Please try again.",
            isUser: false,
            timestamp: new Date(),
            isLoading: false
          };
        } else {
          // If no loading message is found, add a new error message
          newMessages.push({
            id: Date.now().toString(),
            text: "Sorry, there was an error generating the image. Please try again.",
            isUser: false,
            timestamp: new Date()
          });
        }
        return newMessages;
      });
    }
  });

  // Rest of the component code remains the same...
  
  // Query for user information
  const { isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    // Skip fetching if not authenticated
    enabled: useAuthStore.getState().isAuthenticated,
   
    onSuccess: (data: any) => {
      useAuthStore.getState().setUser(data);
    },
    onError: () => {
      // If we can't fetch user data, probably the token is invalid
      handleLogout();
    },
  });

  // Query for getting all documents
  const documentsQuery = useQuery({
    queryKey: ['documents'],
    queryFn: documentApi.getDocuments,
    enabled: useAuthStore.getState().isAuthenticated,
  });

  useEffect(() => {
    // Verify token on component mount
    const verifyAuthentication = async () => {
      const isValid = await authService.verifyToken();
      if (!isValid) {
        router.push("/login");
      }
    };

    verifyAuthentication();
  }, [router]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (text: string): void => {
    if (!text.trim()) return;
   
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };
   
    // Add a loading message for the AI
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "...",
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };
   
    setMessages(prev => [...prev, newUserMessage, loadingMessage]);
   
    // Send query to API
    queryMutation.mutate({
      query: text,
      documentId: selectedDocumentId
    });
  };

  const handleGenerateImage = (prompt: string): void => {
    if (!prompt.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: `Generate image: ${prompt}`,
      isUser: true,
      timestamp: new Date()
    };
    
    // Add a loading message for the image generation
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "Generating image...",
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, newUserMessage, loadingMessage]);
    
    // Generate image
    imageMutation.mutate(prompt);
  };

  const handleLogout = (): void => {
    // Call the logout method from auth store
    logout();
    // Redirect to login page
    router.push("/login");
  };

  const toggleSettings = (): void => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleDocumentSelect = (docId: number | undefined): void => {
    setSelectedDocumentId(docId);
    setIsSettingsOpen(false);
  };

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state if fetching user data fails
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Failed to load user data. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-zinc-900 overflow-hidden">
      {/* Header - using the username from the store */}
      <Header
        title={selectedDocumentId ? 
          `Querying: ${documentsQuery.data?.find(d => d.id === selectedDocumentId)?.title || 'Document'}` : 
          "AI Assistant"}
        username={user?.username || "Guest"}
        onSettingsClick={toggleSettings}
        onLogoutClick={handleLogout}
      />
     
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow
          messages={messages}
          messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
        />
       
        <ChatInput
          placeholders={placeholders}
          onSendMessage={handleSendMessage}
          onGenerateImage={handleGenerateImage}
          isDisabled={queryMutation.isPending || imageMutation.isPending}
        />
      </div>

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        documents={documentsQuery.data || []}
        selectedDocumentId={selectedDocumentId}
        onDocumentSelect={handleDocumentSelect}
        isLoading={documentsQuery.isLoading}
      />
    </div>
  );
}