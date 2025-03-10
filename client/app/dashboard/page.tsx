"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import UserProfile from "@/components/user-profile";
import UserList from "@/components/user-list";
import ChatWindow from "@/components/chat-window";
import type { User } from "@/types";

// Mock other users data
const otherUsers: User[] = [
  {
    citizenIdentificationCard: "001202038007",
    username: "dangthizeo",
    name: "Dang Thi Zeo",
    gender: "male",
    dateOfBirth: "2020-02-01",
    address: "456 Oak Ave, Town, Country",
    phoneNumber: "+1 (555) 987-6543",
  },
  {
    citizenIdentificationCard: "001202038008",
    username: "dangthizeo2",
    name: "Dang Thi Zeo 2",
    gender: "male",
    dateOfBirth: "2020-02-01",
    address: "456 Oak Ave, Town, Country",
    phoneNumber: "+1 (555) 987-6543",
  },
  {
    citizenIdentificationCard: "001202038009",
    username: "dangthizeo3",
    name: "Dang Thi Zeo 3",
    gender: "male",
    dateOfBirth: "2020-02-01",
    address: "456 Oak Ave, Town, Country",
    phoneNumber: "+1 (555) 987-6543",
  },
];

interface ChatWindowInstance {
  id: string;
  user: User;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeChats, setActiveChats] = useState<ChatWindowInstance[]>([]);

  // Convert auth user to chat user format
  const currentUser: User = {
    citizenIdentificationCard: user?.citizenIdentificationCard || "",
    username: user?.username || "",
    name: user?.name || "",
    gender: user?.gender || "",
    dateOfBirth: user?.dateOfBirth || "",
    address: user?.address || "",
    phoneNumber: user?.phoneNumber || "",
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const startChat = (chatUser: User) => {
    if (
      !activeChats.find(
        (chat) =>
          chat.user.citizenIdentificationCard ===
          chatUser.citizenIdentificationCard
      )
    ) {
      setActiveChats((prev) => [
        ...prev,
        {
          id: `chat-${Date.now()}`,
          user: chatUser,
        },
      ]);
    }
  };

  const closeChat = (chatId: string) => {
    setActiveChats((prev) => prev.filter((chat) => chat.id !== chatId));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="border-b bg-white">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Chat Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Welcome, {user.username}!
              </span>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 pb-32">
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
      <div className="fixed bottom-4 right-4 flex flex-row-reverse gap-3 z-50">
        {activeChats.map((chat) => (
          <ChatWindow
            key={chat.id}
            windowId={chat.id}
            user={chat.user}
            onClose={() => closeChat(chat.id)}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
}
