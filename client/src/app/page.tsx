"use client";

import { useState } from "react";
import UserProfile from "@/components/user-profile";
import UserList from "@/components/user-list";
import ChatWindow from "@/components/chat-window";
import type { User } from "@/types";

// Mock current user data
const currentUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, City, Country",
  avatar: "/placeholder.svg?height=40&width=40",
};

// Mock other users data
const otherUsers: User[] = [
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, Town, Country",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "+1 (555) 456-7890",
    address: "789 Pine St, Village, Country",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    phone: "+1 (555) 234-5678",
    address: "101 Elm St, Suburb, Country",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function Home() {
  const [activeChats, setActiveChats] = useState<User[]>([]);

  const startChat = (user: User) => {
    if (!activeChats.find((chat) => chat.id === user.id)) {
      setActiveChats([...activeChats, user]);
    }
  };

  const closeChat = (userId: string) => {
    setActiveChats(activeChats.filter((chat) => chat.id !== userId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 pb-32">
        <h1 className="text-2xl font-bold mb-6">Chat Application</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Section */}
          <div className="md:col-span-1">
            <UserProfile user={currentUser} />
          </div>

          {/* User List Section */}
          <div className="md:col-span-2">
            <UserList users={otherUsers} onStartChat={startChat} />
          </div>
        </div>
      </div>

      {/* Chat Windows */}
      <div className="fixed bottom-0 right-4 flex gap-3 z-50">
        {activeChats.map((user) => (
          <ChatWindow
            key={user.id}
            user={user}
            onClose={() => closeChat(user.id)}
          />
        ))}
      </div>
    </div>
  );
}
