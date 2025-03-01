import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types";
import { MessageSquare, MoreVertical, UserCircle } from "lucide-react";
import Link from "next/link";

interface UserListProps {
  users: User[];
  onStartChat: (user: User) => void;
}

export default function UserList({ users, onStartChat }: UserListProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-primary/10 pb-2">
        <CardTitle>Other Users</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {users.map((user) => (
            <UserItem
              key={user.citizenIdentificationCard}
              user={user}
              onStartChat={() => onStartChat(user)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface UserItemProps {
  user: User;
  onStartChat: () => void;
}

function UserItem({ user, onStartChat }: UserItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.username}</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onStartChat}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Chat</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/profile/${user.citizenIdentificationCard}`}>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
