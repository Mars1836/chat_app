export interface User {
  name: string;
  citizenIdentificationCard?: string;
  username?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  phoneNumber?: string;
  id: string;
  publicKey?: string;
  privateKey?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: number;
  senderId: string;
  receiverId: string;
  ivA?: string;
  ivB?: string;
}
export interface ChatWindowInstance {
  id: string;
  user: User;
  messages: Message[];
}
