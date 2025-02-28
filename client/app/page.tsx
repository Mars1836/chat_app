"use client"
import type { User } from "@/types"
import LoginForm from "@/components/login-form"

// Mock current user data
const currentUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, City, Country",
  avatar: "/placeholder.svg?height=40&width=40",
}

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
]

interface ChatWindowInstance {
  id: string
  user: User
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
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

