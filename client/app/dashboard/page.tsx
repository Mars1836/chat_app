"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import UserProfile from "@/components/user-profile";
import UserList from "@/components/user-list";
import ChatWindow from "@/components/chat-window";
import type { Message, User } from "@/types";
import socket from "@/lib/socket";
import apiPath from "@/api_path";
// Mock other users data
import type { ChatWindowInstance } from "@/types";
import { decryptMessage, encryptMessage } from "@/utils";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
  const [activeChats, setActiveChats] = useState<ChatWindowInstance[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const handleNewMessage = useCallback(
    async (msg: Message) => {
      let chatUser: User;
      if (msg.senderId === user?.id) {
        msg.sender = "user";

        chatUser =
          otherUsers.find((user) => user.id === msg.receiverId) ||
          (await apiPath.getUserById(msg.receiverId)).data;
      } else {
        msg.sender = "other";
        chatUser =
          otherUsers.find((user) => user.id === msg.senderId) ||
          (await apiPath.getUserById(msg.senderId)).data;
      }
      let decryptedMsg: Message;
      if (msg.sender === "user") {
        decryptedMsg = decryptMessage(
          msg,
          msg.ivB || "",
          user?.privateKey || ""
        );
        setActiveChats((prev) =>
          prev.map((chat) =>
            chat.id === chatUser.id
              ? { ...chat, messages: [...chat.messages, decryptedMsg] }
              : chat
          )
        );
      } else {
        decryptedMsg = decryptMessage(
          msg,
          msg.ivA || "",
          user?.privateKey || ""
        );
        const existingChat = activeChats.find(
          (chat) => chat.id === chatUser.id
        );
        if (existingChat) {
          setActiveChats((prev) =>
            prev.map((chat) =>
              chat.id === chatUser.id
                ? {
                    ...chat,
                    messages: [...chat.messages, decryptedMsg],
                  }
                : chat
            )
          );
        } else {
          const messages = await firstLoadMessages(chatUser);
          setActiveChats((prev) => [
            {
              id: chatUser.id,
              user: chatUser,
              messages: messages,
            },
            ...prev,
          ]);
        }
      }
    },
    [user, otherUsers, activeChats]
  );
  const firstLoadMessages = useCallback(
    async (chatUser: User) => {
      const { data } = await apiPath.getMessages(user?.id || "", chatUser.id);
      const messages = data.map((msg: Message) => {
        if (msg.senderId === user?.id) {
          msg.sender = "user";
          msg.text = decryptMessage(
            msg,
            msg.ivB || "",
            user?.privateKey || ""
          ).text;
        } else {
          msg.sender = "other";
          msg.text = decryptMessage(
            msg,
            msg.ivA || "",
            user?.privateKey || ""
          ).text;
        }
        return msg;
      });
      return messages;
    },
    [user]
  );
  useEffect(() => {
    socket.emit("get-online-users");

    if (!user) {
      return;
    }
    const getOtherUsers = async () => {
      const res = await apiPath.getOtherUsers();
      setOtherUsers(res.data);
    };
    socket.on("onlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });
    getOtherUsers();
    return () => {
      socket.off("onlineUsers");
    };
  }, [user]);
  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    socket.on("chat_message", handleNewMessage);
    socket.on("onlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });
    return () => {
      socket.off("chat_message");
      socket.off("onlineUsers");
    };
  }, [user, router, activeChats, otherUsers]);

  const startChat = async (chatUser: User) => {
    const messages = await firstLoadMessages(chatUser);
    if (!activeChats.find((chat) => chat.user.id === chatUser.id)) {
      setActiveChats((prev) => [
        ...prev,
        {
          id: chatUser.id,
          user: chatUser,
          messages: messages,
        },
      ]);
    }
  };
  const handleSendMessage = (message: string, userReceiver: User) => {
    if (message.trim()) {
      const messageData: Message = {
        text: message,
        senderId: user?.id || "",
        receiverId: userReceiver.id,
        id: `${Date.now()}-${Math.random()}`.toString().slice(0, 15),
        sender: "user",
        timestamp: Date.now(),
      };
      if (!userReceiver.publicKey || !user?.publicKey) {
        console.log("User not found");
        return;
      }
      const encryptedMessage = encryptMessage(
        messageData,
        userReceiver.publicKey,
        user?.publicKey
      );
      socket.emit("chat_message", encryptedMessage);
      handleNewMessage(encryptedMessage);
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
            <UserProfile user={user} />
          </div>

          {/* User List Section */}
          <div className="md:col-span-2">
            <UserList
              users={otherUsers}
              onStartChat={startChat}
              onlineUsers={onlineUsers}
            />
          </div>
        </div>
      </div>

      {/* Chat Windows */}
      <div className="fixed bottom-4 right-4 flex flex-row-reverse gap-3 z-50 items-end">
        {activeChats.map((chat) => {
          const isOnline = onlineUsers.includes(chat.user.id);

          return (
            <ChatWindow
              key={chat.id}
              windowId={chat.id}
              user={chat.user}
              onClose={() => closeChat(chat.id)}
              isOnline={isOnline}
              messages={chat.messages}
              onSendMessage={(message, userReceiver) =>
                handleSendMessage(message, userReceiver)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
