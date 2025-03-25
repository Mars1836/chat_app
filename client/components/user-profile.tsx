import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types";
import {
  Mail,
  Phone,
  MapPin,
  UserIcon,
  Mars,
  Venus,
  Calendar,
  IdCard,
} from "lucide-react";

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-primary/10 pb-6">
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
            {user.name.charAt(0)}
          </div>
          <span>My Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>
          {user.citizenIdentificationCard && (
            <div className="flex items-center gap-2">
              <IdCard className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Citizen Identification Card
                </p>
                <p className="font-medium">{user.citizenIdentificationCard}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{user.address}</p>
            </div>
          </div>
          {user.gender === "male" ? (
            <div className="flex items-center gap-2">
              <Mars className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">Male</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Venus className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">Female</p>
              </div>
            </div>
          )}
          {user.dateOfBirth && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{user.dateOfBirth}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
