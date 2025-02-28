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
import { X, Send, Maximize, Minimize } from "lucide-react";
import socket from "@/lib/socket";

interface Message {
  text: string;
  sender: "user" | "other";
  timestamp: number;
}

interface ChatWindowProps {
  user: User;
  onClose: () => void;
}

export default function ChatWindow({ user, onClose }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [minimized, setMinimized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle socket connection
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onChatMessage(msg: string) {
      // Only add the message if it's not from the current user
      if (msg.startsWith(`${user.name}:`)) return;

      setMessages((prev) => [
        ...prev,
        {
          text: msg,
          sender: "other",
          timestamp: Date.now(),
        },
      ]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat message", onChatMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat message", onChatMessage);
    };
  }, [user.name]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      // Format message with user name
      const formattedMessage = `${user.name}: ${message}`;

      // Send message through socket
      socket.emit("chat message", formattedMessage);

      // Add message to local state
      setMessages((prev) => [
        ...prev,
        {
          text: message,
          sender: "user",
          timestamp: Date.now(),
        },
      ]);

      setMessage("");
    }
  };

  return (
    <Card
      className={`w-[330px] shadow-lg transition-all ${
        minimized ? "h-12" : "h-[450px]"
      } rounded-lg overflow-hidden`}
    >
      <CardHeader className="bg-[#0084ff] text-white p-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-full h-full object-cover"
            />
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
            onClick={() => setMinimized(!minimized)}
          >
            {minimized ? (
              <Maximize className="h-4 w-4" />
            ) : (
              <Minimize className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!minimized && (
        <>
          <CardContent className="p-4 h-[calc(100%-120px)] overflow-y-auto bg-white">
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
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
        </>
      )}
    </Card>
  );
}
