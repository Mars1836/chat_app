"use client";
import type { User } from "@/types";
import LoginForm from "@/components/login-form";

// Mock current user data

// Mock other users data

interface ChatWindowInstance {
  id: string;
  user: User;
}

export default function Home() {
  // const [activeChats, setActiveChats] = useState<ChatWindowInstance[]>([])

  // const startChat = (user: User) => {
  //   if (!activeChats.find((chat) => chat.user.id === user.id)) {
  //     setActiveChats((prev) => [
  //       ...prev,
  //       {
  //         id: `chat-${Date.now()}`,
  //         user,
  //       },
  //     ])
  //   }
  // }

  // const closeChat = (chatId: string) => {
  //   setActiveChats((prev) => prev.filter((chat) => chat.id !== chatId))
  // }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
