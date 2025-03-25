"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types";
import {
  Phone,
  MapPin,
  ArrowLeft,
  User as UserIcon,
  IdCard as IdCardIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import apiPath from "@/api_path";

// Mock users data

export default function UserProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const response = await apiPath.getUserByUsername(params.id as string);
      setUser(response.data);
      console.log(response.data);
    };
    fetchUser();
  }, [params.id]);
  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="inline-block mb-6">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <Card className="max-w-2xl mx-auto shadow-md">
        <CardHeader className="bg-primary/10 pb-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md flex items-center justify-center bg-primary text-white text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <UserIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IdCardIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Citizen Identification Card
                </p>
                <p className="font-medium">{user.citizenIdentificationCard}</p>
              </div>
            </div>
            {user.dateOfBirth && (
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{user.dateOfBirth}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{user.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
