"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User } from "@/types";
import { X, Send, Minimize } from "lucide-react";
import socket from "@/lib/socket";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: number;
  senderName: string;
}

interface ChatWindowProps {
  user: User;
  currentUser: User;
  onClose: () => void;
  windowId: string;
}

export default function ChatWindow({
  user,
  currentUser,
  onClose,
  windowId,
}: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [minimized, setMinimized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onChatMessage(msg: { text: string; senderName: string }) {
      if (msg.senderName === currentUser.name) return;

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          text: msg.text,
          sender: "other",
          timestamp: Date.now(),
          senderName: msg.senderName,
        },
      ]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(`chat message ${windowId}`, onChatMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(`chat message ${windowId}`, onChatMessage);
    };
  }, [currentUser.name, windowId]);

  useEffect(() => {
    if (!minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [minimized]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      const messageData = {
        text: message,
        senderName: currentUser.name,
      };

      socket.emit("chat message", messageData);

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          text: message,
          sender: "user",
          timestamp: Date.now(),
          senderName: currentUser.name,
        },
      ]);

      setMessage("");
    }
  };

  const handleClose = () => {
    socket.off(`chat message ${windowId}`);
    onClose();
  };

  if (minimized) {
    return (
      <Card className="w-[200px] h-12 shadow-lg rounded-lg overflow-hidden cursor-pointer">
        <div
          className="bg-[#0084ff] text-white p-3 flex items-center justify-between h-full"
          onClick={() => setMinimized(false)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-primary text-white text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <span className="font-semibold truncate text-sm">{user.name}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/10 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-[330px] h-[450px] shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-[#0084ff] text-white p-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10">
            <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
          <div>
            <span className="font-semibold">{user.name}</span>
            <div className="text-xs opacity-75">
              {isConnected ? "Online" : "Connecting..."}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10 rounded-full"
            onClick={() => setMinimized(true)}
          >
            <Minimize className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10 rounded-full"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 h-[calc(100%-120px)] overflow-y-auto bg-white">
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                  msg.sender === "user"
                    ? "bg-[#0084ff] text-white"
                    : "bg-[#f0f0f0] text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="p-3 border-t bg-white">
        <form
          onSubmit={handleSendMessage}
          className="flex w-full gap-2 items-center"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-gray-200 focus-visible:ring-1 focus-visible:ring-[#0084ff] focus-visible:ring-offset-0"
            disabled={!isConnected}
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 rounded-full bg-[#0084ff] hover:bg-[#0084ff]/90 text-white"
            disabled={!isConnected}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
