"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types";
import { Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock users data
const users: User[] = [
  {
    citizenIdentificationCard: "001202038007",
    username: "dangthizeo",
    name: "Dang Thi Zeo",
    gender: "male",
    dateOfBirth: "2020-02-01",
    address: "789 Pine St, Village, Country",
    phoneNumber: "+1 (555) 456-7890",
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
    address: "789 Pine St, Village, Country",
    phoneNumber: "+1 (555) 456-7890",
  },
  {
    citizenIdentificationCard: "001202038010",
    username: "dangthizeo4",
    name: "Dang Thi Zeo 4",
    gender: "male",
    dateOfBirth: "2020-02-01",
    address: "101 Elm St, Suburb, Country",
    phoneNumber: "+1 (555) 234-5678",
  },
];

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  // Find the user with the matching ID
  const user = users.find((u) => u.citizenIdentificationCard === userId);

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
              <Mail className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{user.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
